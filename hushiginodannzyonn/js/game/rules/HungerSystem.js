export class HungerSystem {
  constructor({ config, messageLog }) {
    this.config = config;
    this.messageLog = messageLog;
  }

  consume(player) {
    if (player.maxHunger == null) {
      return;
    }

    player.hunger = Math.max(0, player.hunger - this.config.hunger.consumePerTurn);
    if (player.hunger > 0) {
      return;
    }

    player.hp = Math.max(0, player.hp - this.config.hunger.starvationDamage);
    this.messageLog.push(`空腹で${this.config.hunger.starvationDamage}ダメージを受けた。`);
    if (player.hp === 0) {
      player.alive = false;
      player.blocksMovement = false;
    }
  }
}
