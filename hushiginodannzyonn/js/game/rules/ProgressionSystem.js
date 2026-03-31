function nextThreshold(current, growth) {
  return Math.ceil(current * growth);
}

export class ProgressionSystem {
  constructor({ config, messageLog }) {
    this.config = config;
    this.messageLog = messageLog;
  }

  grantXp(player, amount) {
    player.xp += amount;
    this.messageLog.push(`${amount}経験値を得た。`);

    while (player.xp >= player.xpToNext) {
      player.xp -= player.xpToNext;
      player.level += 1;
      player.maxHp += this.config.progression.hpGainPerLevel;
      player.hp = player.maxHp;

      if (player.level % this.config.progression.attackGainEvery === 0) {
        player.attack += 1;
      }

      if (player.level % this.config.progression.defenseGainEvery === 0) {
        player.defense += 1;
      }

      player.xpToNext = nextThreshold(player.xpToNext, this.config.progression.xpGrowth);
      this.messageLog.push(`レベルが${player.level}になった。最大HPが上がった。`);
    }
  }
}
