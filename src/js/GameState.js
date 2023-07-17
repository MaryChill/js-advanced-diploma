export default class GameState {
  constructor() {
    this.statistics = [];
    this.balls = 0;
  }

  static from(object) {
    // TODO: create object
    if (object.level > 4) {
      object.state = 'gameOver';
    }
    return object;
  }
}
