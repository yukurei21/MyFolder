export class TileMap {
  constructor(width, height, fillType = 'wall') {
    this.width = width;
    this.height = height;
    this.tiles = Array.from({ length: width * height }, () => ({ type: fillType }));
  }

  isInside(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  indexOf(x, y) {
    return y * this.width + x;
  }

  get(x, y) {
    if (!this.isInside(x, y)) {
      return { type: 'void' };
    }

    return this.tiles[this.indexOf(x, y)];
  }

  set(x, y, type) {
    if (!this.isInside(x, y)) {
      return;
    }

    this.tiles[this.indexOf(x, y)] = { type };
  }

  isWalkable(x, y) {
    const tile = this.get(x, y);
    return tile.type === 'floor' || tile.type === 'stairsDown';
  }

  forEach(callback) {
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        callback(this.get(x, y), x, y);
      }
    }
  }
}
