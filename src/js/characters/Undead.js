import Character from '../Character';

export default class Undead extends Character {
  constructor(level) {
    super(level, 'undead');
    this.attack = 40;
    this.defence = 10;
    this.possibleMoves = 4;
    this.possibleAttacks = 1;
  }
}
