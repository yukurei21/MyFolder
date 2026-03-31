export class Registry {
  constructor() {
    this.items = new Map();
  }

  set(key, value) {
    this.items.set(key, value);
    return value;
  }

  get(key) {
    return this.items.get(key);
  }

  has(key) {
    return this.items.has(key);
  }
}
