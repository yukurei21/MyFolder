export class TurnManager {
  constructor({ combatSystem, progressionSystem, hungerSystem, enemyBrain, messageLog }) {
    this.combatSystem = combatSystem;
    this.progressionSystem = progressionSystem;
    this.hungerSystem = hungerSystem;
    this.enemyBrain = enemyBrain;
    this.messageLog = messageLog;
  }

  tryPlayerAction(state, command) {
    const player = state.entities.get(state.playerId);
    if (!player || !player.alive) {
      return false;
    }

    if (command.type === 'wait') {
      this.messageLog.push('その場で様子を見た。');
      return true;
    }

    if (command.type !== 'move') {
      return false;
    }

    const nextX = player.x + command.dx;
    const nextY = player.y + command.dy;

    if (!state.map.isWalkable(nextX, nextY)) {
      this.messageLog.push('壁が行く手をふさいでいる。');
      return false;
    }

    const target = state.entities.at(nextX, nextY, { onlyBlocking: true });
    if (target && target.faction === 'enemy') {
      const result = this.combatSystem.attack(player, target);
      if (result.defeated) {
        this.progressionSystem.grantXp(player, target.xpValue);
      }
      return true;
    }

    if (target) {
      return false;
    }

    player.x = nextX;
    player.y = nextY;
    return true;
  }

  runEnemyPhase(state) {
    const player = state.entities.get(state.playerId);
    if (!player || !player.alive) {
      return;
    }

    for (const enemy of state.entities.livingEnemies()) {
      this.enemyBrain.decide({
        state,
        enemy,
        player,
        attack: (attacker, defender) => {
          this.combatSystem.attack(attacker, defender);
        },
      });

      if (!player.alive) {
        return;
      }
    }
  }

  endTurn(state) {
    const player = state.entities.get(state.playerId);
    if (!player || !player.alive) {
      return;
    }

    this.hungerSystem.consume(player);
    state.turnCount += 1;
  }
}
