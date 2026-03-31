export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(eventName, listener) {
    const bucket = this.listeners.get(eventName) ?? new Set();
    bucket.add(listener);
    this.listeners.set(eventName, bucket);

    return () => {
      bucket.delete(listener);
    };
  }

  emit(eventName, payload) {
    const bucket = this.listeners.get(eventName);
    if (!bucket) {
      return;
    }

    for (const listener of bucket) {
      listener(payload);
    }
  }
}
