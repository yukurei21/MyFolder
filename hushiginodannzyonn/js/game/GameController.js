function clonePlayerStats(player) {
  return {
    hp: player.hp,
    maxHp: player.maxHp,
    attack: player.attack,
    defense: player.defense,
    level: player.level,
    xp: player.xp,
    xpToNext: player.xpToNext,
    hunger: player.hunger,
    maxHunger: player.maxHunger,
  };
}

export class GameController {
  constructor({ bus, config, messageLog, floorBuilder, turnManager }) {
    this.bus = bus;
    this.config = config;
    this.messageLog = messageLog;
    this.floorBuilder = floorBuilder;
    this.turnManager = turnManager;
    this.state = null;
  }

  startNewRun() {
    this.messageLog.clear();
    this.messageLog.push('冒険を始めた。');
    this.state = this.floorBuilder.buildFloor({ floorNumber: 1 });
    this.publish();
  }

  handleCommand(command) {
    if (!this.state) {
      return;
    }

    if (this.state.status === 'gameover') {
      if (command.type === 'restart') {
        this.startNewRun();
      }
      return;
    }

    if (this.state.status !== 'running') {
      return;
    }

    if (command.type === 'descend') {
      this.tryDescend();
      return;
    }

    const consumedTurn = this.turnManager.tryPlayerAction(this.state, command);
    if (!consumedTurn) {
      this.publish();
      return;
    }

    this.turnManager.runEnemyPhase(this.state);
    this.turnManager.endTurn(this.state);
    this.resolveStateTransitions();
    this.publish();
  }

  tryDescend() {
    const player = this.state.entities.get(this.state.playerId);
    if (!player) {
      return;
    }

    const standingOnStairs = player.x === this.state.stairs.x && player.y === this.state.stairs.y;
    if (!standingOnStairs) {
      this.messageLog.push('ここには降りる階段がない。');
      this.publish();
      return;
    }

    this.state = this.floorBuilder.buildFloor({
      floorNumber: this.state.floorNumber + 1,
      previousPlayer: clonePlayerStats(player),
    });
    this.publish();
  }

  resolveStateTransitions() {
    const player = this.state.entities.get(this.state.playerId);
    if (!player || !player.alive || player.hp <= 0) {
      this.state.status = 'gameover';
      this.messageLog.push('力尽きた……。Rキーで再挑戦。');
      return;
    }

    const remainingEnemies = this.state.entities.livingEnemies().length;
    if (remainingEnemies === 0 && !this.state.floorClearAnnounced) {
      this.state.floorClearAnnounced = true;
      this.messageLog.push('フロアの敵を一掃した。階段を探そう。');
    }
  }

  createSummary() {
    const player = this.state.entities.get(this.state.playerId);
    const hpRate = player.maxHp > 0 ? player.hp / player.maxHp : 0;
    const hungerRate = player.maxHunger ? player.hunger / player.maxHunger : 0;

    return [
      ['状態', this.state.status === 'gameover' ? 'ゲームオーバー' : '探索中'],
      ['階層', `地下${this.state.floorNumber}階`],
      ['ターン', `${this.state.turnCount}`],
      ['HP', `${player.hp} / ${player.maxHp}`, hpRate <= 0.34 ? 'hp-low' : 'good'],
      ['レベル', `${player.level}`],
      ['経験値', `${player.xp} / ${player.xpToNext}`],
      ['こうげき', `${player.attack}`],
      ['ぼうぎょ', `${player.defense}`],
      ['満腹度', `${player.hunger} / ${player.maxHunger}`, hungerRate <= 0.25 ? 'hp-low' : ''],
      ['敵の数', `${this.state.entities.livingEnemies().length}`],
    ];
  }

  publish() {
    this.bus.emit('game:updated', {
      state: this.state,
      summary: this.createSummary(),
      messages: this.messageLog.toArray(),
    });
  }
}
