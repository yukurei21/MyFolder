import { commandFromKey } from './keymap.js';

export class InputController {
  constructor({ target, onCommand }) {
    this.target = target;
    this.onCommand = onCommand;
    this.boundHandleKeyDown = (event) => this.handleKeyDown(event);
  }

  attach() {
    this.target.addEventListener('keydown', this.boundHandleKeyDown);
  }

  handleKeyDown(event) {
    const command = commandFromKey(event);
    if (!command) {
      return;
    }

    event.preventDefault();
    this.onCommand(command);
  }
}
