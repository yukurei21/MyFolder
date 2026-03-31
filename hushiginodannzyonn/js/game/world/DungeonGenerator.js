import { TileMap } from './TileMap.js';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function intersects(roomA, roomB) {
  return !(
    roomA.x + roomA.w < roomB.x - 1 ||
    roomB.x + roomB.w < roomA.x - 1 ||
    roomA.y + roomA.h < roomB.y - 1 ||
    roomB.y + roomB.h < roomA.y - 1
  );
}

function centerOf(room) {
  return {
    x: Math.floor(room.x + room.w / 2),
    y: Math.floor(room.y + room.h / 2),
  };
}

export class DungeonGenerator {
  constructor(config) {
    this.config = config;
  }

  generate() {
    const { width, height, maxRooms, roomMinSize, roomMaxSize, generationRetries } = this.config.map;

    for (let attempt = 0; attempt < generationRetries; attempt += 1) {
      const map = new TileMap(width, height, 'wall');
      const rooms = [];

      for (let i = 0; i < maxRooms; i += 1) {
        const w = randomInt(roomMinSize, roomMaxSize);
        const h = randomInt(roomMinSize, roomMaxSize);
        const x = randomInt(1, width - w - 2);
        const y = randomInt(1, height - h - 2);
        const room = { x, y, w, h };

        if (rooms.some((other) => intersects(room, other))) {
          continue;
        }

        rooms.push(room);
        this.carveRoom(map, room);

        if (rooms.length > 1) {
          const current = centerOf(room);
          const previous = centerOf(rooms[rooms.length - 2]);
          this.carveCorridor(map, previous, current);
        }
      }

      if (rooms.length >= 4) {
        const start = centerOf(rooms[0]);
        const stairs = centerOf(rooms[rooms.length - 1]);
        map.set(stairs.x, stairs.y, 'stairsDown');
        return { map, rooms, start, stairs };
      }
    }

    throw new Error('ダンジョン生成に失敗しました');
  }

  carveRoom(map, room) {
    for (let y = room.y; y < room.y + room.h; y += 1) {
      for (let x = room.x; x < room.x + room.w; x += 1) {
        map.set(x, y, 'floor');
      }
    }
  }

  carveCorridor(map, from, to) {
    const horizontalFirst = Math.random() > 0.5;

    if (horizontalFirst) {
      this.carveHorizontal(map, from.x, to.x, from.y);
      this.carveVertical(map, from.y, to.y, to.x);
      return;
    }

    this.carveVertical(map, from.y, to.y, from.x);
    this.carveHorizontal(map, from.x, to.x, to.y);
  }

  carveHorizontal(map, x1, x2, y) {
    const [start, end] = x1 <= x2 ? [x1, x2] : [x2, x1];
    for (let x = start; x <= end; x += 1) {
      map.set(x, y, 'floor');
    }
  }

  carveVertical(map, y1, y2, x) {
    const [start, end] = y1 <= y2 ? [y1, y2] : [y2, y1];
    for (let y = start; y <= end; y += 1) {
      map.set(x, y, 'floor');
    }
  }
}
