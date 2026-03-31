export class App {
  constructor({ controller, inputController }) {
    this.controller = controller;
    this.inputController = inputController;
    this.started = false;
  }

  start() {
    if (this.started) {
      return;
    }

    this.started = true;
    this.inputController.attach();
    this.controller.startNewRun();
  }
}
