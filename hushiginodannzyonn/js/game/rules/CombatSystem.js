function rollVariance(maxVariance) {
  return Math.floor(Math.random() * (maxVariance + 1));
}

export class CombatSystem {
  constructor({ config, messageLog }) {
    this.config = config;
    this.messageLog = messageLog;
  }

  attack(attacker, defender) {
    const damage = Math.max(1, attacker.attack - defender.defense + rollVariance(this.config.combat.variance));
    defender.hp -= damage;
    this.messageLog.push(`${attacker.name}の攻撃。${defender.name}に${damage}ダメージ。`);

    if (defender.hp <= 0) {
      defender.hp = 0;
      defender.alive = false;
      defender.blocksMovement = false;
      this.messageLog.push(`${defender.name}をたおした。`);
    }

    return {
      damage,
      defeated: defender.alive === false,
    };
  }
}
