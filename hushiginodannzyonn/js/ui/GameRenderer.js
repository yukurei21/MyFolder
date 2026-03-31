function entitySort(a, b) {
  if (a.faction === 'player') {
    return 1;
  }
  if (b.faction === 'player') {
    return -1;
  }
  return 0;
}

export class GameRenderer {
  constructor({ canvas, config }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.config = config;
    this.tileSize = config.screen.tileSize;
    this.canvas.width = config.screen.width;
    this.canvas.height = config.screen.height;
  }

  render(state) {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = '#0a0f14';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawMap(state);
    this.drawEntities(state);
    this.drawOverlay(state);
  }

  drawMap(state) {
    const { ctx } = this;
    ctx.font = `${this.tileSize - 8}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    state.map.forEach((tile, x, y) => {
      const px = x * this.tileSize;
      const py = y * this.tileSize;

      if (tile.type === 'wall') {
        ctx.fillStyle = this.config.colors.wall;
        ctx.fillRect(px, py, this.tileSize, this.tileSize);
        ctx.fillStyle = '#314155';
        ctx.fillText('#', px + this.tileSize / 2, py + this.tileSize / 2 + 1);
        return;
      }

      ctx.fillStyle = (x + y) % 2 === 0 ? this.config.colors.floor : this.config.colors.floorAccent;
      ctx.fillRect(px, py, this.tileSize, this.tileSize);

      if (tile.type === 'stairsDown') {
        ctx.fillStyle = this.config.colors.stairs;
        ctx.fillText('>', px + this.tileSize / 2, py + this.tileSize / 2 + 1);
      }
    });
  }

  drawEntities(state) {
    const { ctx } = this;
    const entities = state.entities.living().sort(entitySort);

    ctx.font = `${this.tileSize - 6}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    for (const entity of entities) {
      const px = entity.x * this.tileSize;
      const py = entity.y * this.tileSize;
      ctx.fillStyle = this.config.colors.enemyShadow;
      ctx.fillText(entity.glyph, px + this.tileSize / 2 + 1, py + this.tileSize / 2 + 2);
      ctx.fillStyle = entity.color;
      ctx.fillText(entity.glyph, px + this.tileSize / 2, py + this.tileSize / 2);
    }
  }

  drawOverlay(state) {
    if (state.status !== 'gameover') {
      return;
    }

    const { ctx } = this;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.62)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 16);
    ctx.font = '20px sans-serif';
    ctx.fillText('Rキーで再挑戦', this.canvas.width / 2, this.canvas.height / 2 + 30);
  }
}
