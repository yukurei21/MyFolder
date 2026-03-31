export class LogView {
  constructor({ root }) {
    this.root = root;
  }

  render(messages, status) {
    const withHint =
      status === 'gameover'
        ? [...messages, 'Rキーで新しい冒険を始められます。']
        : messages;

    this.root.innerHTML = withHint
      .map((message) => `<li>${message}</li>`)
      .join('');
  }
}
