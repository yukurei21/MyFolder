import { Pathfinder } from './PathFinder.js';

function distance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export class EnemyBrain {
  constructor({ messageLog }) {
    this.messageLog = messageLog;
    this.pathfinder = new Pathfinder();
  }

  decide({ state, enemy, player, attack }) {
    if (!enemy.alive) {
      return false;
    }

    const manhattan = distance(enemy, player);
    if (manhattan === 1) {
      attack(enemy, player);
      return true;
    }

    const next = this.pathfinder.nextStep({
      map: state.map,
      entities: state.entities,
      start: { x: enemy.x, y: enemy.y },
      goal: { x: player.x, y: player.y },
      blockedId: enemy.id,
    });

    if (!next) {
      return false;
    }

    const occupied = state.entities.at(next.x, next.y, { onlyBlocking: true });
    if (occupied && occupied.id !== player.id && occupied.id !== enemy.id) {
      return false;
    }

    if (next.x === player.x && next.y === player.y) {
      attack(enemy, player);
      return true;
    }

    enemy.x = next.x;
    enemy.y = next.y;
    return true;
  }
}
