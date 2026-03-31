export const gameConfig = {
  screen: {
    width: 960,
    height: 576,
    tileSize: 32,
  },
  map: {
    width: 30,
    height: 18,
    maxRooms: 14,
    roomMinSize: 4,
    roomMaxSize: 8,
    generationRetries: 40,
  },
  player: {
    name: 'トルネコ風主人公',
    glyph: '@',
    color: '#f9fafb',
    maxHp: 24,
    attack: 6,
    defense: 2,
    maxHunger: 100,
  },
  enemies: {
    baseSpawnCount: 6,
    templates: [
      {
        id: 'slime',
        name: 'スライム',
        glyph: 's',
        color: '#86efac',
        hp: 7,
        attack: 3,
        defense: 0,
        xp: 4,
        minFloor: 1,
      },
      {
        id: 'dracky',
        name: 'ドラキー',
        glyph: 'd',
        color: '#c4b5fd',
        hp: 9,
        attack: 4,
        defense: 1,
        xp: 6,
        minFloor: 2,
      },
      {
        id: 'orc',
        name: 'オーク',
        glyph: 'o',
        color: '#fda4af',
        hp: 12,
        attack: 5,
        defense: 1,
        xp: 8,
        minFloor: 3,
      },
    ],
  },
  progression: {
    baseXpToNextLevel: 12,
    xpGrowth: 1.5,
    hpGainPerLevel: 4,
    attackGainEvery: 2,
    defenseGainEvery: 3,
  },
  combat: {
    variance: 2,
  },
  hunger: {
    consumePerTurn: 1,
    starvationDamage: 1,
  },
  log: {
    maxEntries: 10,
  },
  colors: {
    wall: '#243140',
    floor: '#111827',
    floorAccent: '#1f2937',
    stairs: '#fbbf24',
    player: '#f8fafc',
    enemyShadow: 'rgba(0, 0, 0, 0.28)',
    text: '#e5e7eb',
  },
  combat: {
    variance: 2, // 攻撃のダメージ振れ幅
  },
  progression: {
    baseXpToNextLevel: 12,
    hpGainPerLevel: 5,
    attackGainEvery: 2,
    defenseGainEvery: 3,
    xpGrowth: 1.2,
  },
  hunger: {
    consumePerTurn: 0.1,
    starvationDamage: 1,
  },
  log: {
    maxEntries: 50,
  }
}