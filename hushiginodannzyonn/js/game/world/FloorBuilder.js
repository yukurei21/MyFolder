import { DungeonGenerator } from './DungeonGenerator.js';
import { EntityStore } from '../entities/EntityStore.js';
import { EntityFactory } from '../entities/EntityFactory.js';

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  const copied = [...list];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function tilesInRoom(room) {
  const result = [];
  for (let y = room.y + 1; y < room.y + room.h - 1; y += 1) {
    for (let x = room.x + 1; x < room.x + room.w - 1; x += 1) {
      result.push({ x, y });
    }
  }
  return result;
}

export class FloorBuilder {
  constructor({ config, messageLog }) {
    this.config = config;
    this.messageLog = messageLog;
    this.generator = new DungeonGenerator(config);
    this.entityFactory = new EntityFactory(config);
  }

  buildFloor({ floorNumber, previousPlayer = null }) {
    const { map, rooms, start, stairs } = this.generator.generate();
    const entities = new EntityStore();
    const player = entities.add(this.entityFactory.createPlayer(start, previousPlayer));

    const enemyTemplates = this.config.enemies.templates.filter((template) => floorNumber >= template.minFloor);
    const spawnCount = this.config.enemies.baseSpawnCount + floorNumber;
    const candidateTiles = shuffle(rooms.slice(1).flatMap((room) => tilesInRoom(room)));

    for (let i = 0; i < spawnCount && candidateTiles.length > 0; i += 1) {
      const position = candidateTiles.pop();
      if (!position) {
        break;
      }

      if ((position.x === stairs.x && position.y === stairs.y) || (position.x === start.x && position.y === start.y)) {
        continue;
      }

      if (entities.at(position.x, position.y, { onlyBlocking: true })) {
        continue;
      }

      const template = randomFrom(enemyTemplates);
      entities.add(this.entityFactory.createEnemy(template, position, floorNumber));
    }

    this.messageLog.push(`地下${floorNumber}階に降り立った。`);

    return {
      floorNumber,
      map,
      entities,
      playerId: player.id,
      stairs,
      turnCount: 0,
      status: 'running',
      floorClearAnnounced: false,
    };
  }
}
