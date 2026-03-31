function createBaseActor(template, extra = {}) {
  return {
    name: template.name,
    glyph: template.glyph,
    color: template.color,
    x: 0,
    y: 0,
    maxHp: template.maxHp ?? template.hp,
    hp: template.maxHp ?? template.hp,
    attack: template.attack,
    defense: template.defense,
    xpValue: template.xp ?? 0,
    level: template.level ?? 1,
    xp: template.xpCurrent ?? 0,
    xpToNext: template.xpToNext ?? 12,
    hunger: template.maxHunger ?? null,
    maxHunger: template.maxHunger ?? null,
    blocksMovement: true,
    alive: true,
    ...extra,
  };
}

export class EntityFactory {
  constructor(config) {
    this.config = config;
  }

  createPlayer(position, previousStats = null) {
    const template = this.config.player;
    const actor = createBaseActor(template, {
      type: 'player',
      faction: 'player',
      x: position.x,
      y: position.y,
      xpToNext: this.config.progression.baseXpToNextLevel,
    });

    if (!previousStats) {
      return actor;
    }

    return {
      ...actor,
      maxHp: previousStats.maxHp,
      hp: Math.min(previousStats.hp, previousStats.maxHp),
      attack: previousStats.attack,
      defense: previousStats.defense,
      level: previousStats.level,
      xp: previousStats.xp,
      xpToNext: previousStats.xpToNext,
      hunger: previousStats.hunger,
      maxHunger: previousStats.maxHunger,
    };
  }

  createEnemy(template, position, floorNumber) {
    return createBaseActor(template, {
      type: template.id,
      faction: 'enemy',
      x: position.x,
      y: position.y,
      hp: template.hp + Math.max(0, floorNumber - template.minFloor),
      maxHp: template.hp + Math.max(0, floorNumber - template.minFloor),
      attack: template.attack + Math.floor((floorNumber - 1) / 3),
    });
  }
}
