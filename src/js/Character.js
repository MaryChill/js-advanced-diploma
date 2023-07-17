/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    if (new.target.name === 'Character') {
      throw new Error('кто-то использует "new Character()"');
    }
    // TODO: выбросите исключение, если кто-то использует "new Character()"
  }

  levelUp() {
    const healthBefore = this.health;
    const attackBefore = this.attack;
    const defenceBefore = this.defence;

    this.level += 1;
    this.health += 80;

    if (this.health > 100) {
      this.health = 100;
    }

    this.attack = Math.floor(Math.max(attackBefore, (attackBefore * (80 + healthBefore)) / 100));
    this.defence = Math.floor(Math.max(defenceBefore, (defenceBefore * (80 + healthBefore)) / 100));
  }
}
