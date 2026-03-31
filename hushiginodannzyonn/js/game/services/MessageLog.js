export class MessageLog {
  constructor(limit = 10) {
    this.limit = limit;
    this.entries = [];
  }

  clear() {
    this.entries = [];
  }

  push(message) {
    this.entries.unshift(message);
    this.entries = this.entries.slice(0, this.limit);
  }

  toArray() {
    return [...this.entries];
  }
}
