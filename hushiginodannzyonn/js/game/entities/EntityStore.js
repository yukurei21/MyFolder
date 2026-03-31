export class EntityStore {
  constructor() {
    this.entities = new Map();
    this.nextId = 1;
  }

  add(entity) {
    const id = this.nextId;
    this.nextId += 1;

    const stored = { ...entity, id };
    this.entities.set(id, stored);
    return stored;
  }

  get(id) {
    return this.entities.get(id);
  }

  values() {
    return [...this.entities.values()];
  }

  living() {
    return this.values().filter((entity) => entity.alive !== false);
  }

  livingEnemies() {
    return this.living().filter((entity) => entity.faction === 'enemy');
  }

  at(x, y, { onlyBlocking = false } = {}) {
    return (
      this.values().find((entity) => {
        if (entity.alive === false) {
          return false;
        }
        if (onlyBlocking && !entity.blocksMovement) {
          return false;
        }
        return entity.x === x && entity.y === y;
      }) ?? null
    );
  }
}
