import Bowman from './characters/Bowman';
import Magician from './characters/Magician';
import Daemon from './characters/Daemon';
import Swordsman from './characters/Swordsman';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGeneratorforGood(allowedTypes, maxLevel) {
  // TODO: write logic here
  allowedTypes = [Magician, Swordsman, Bowman];
  while (true) {
    const typeRandom = Math.floor(Math.random() * allowedTypes.length);
    const levelRandom = Math.floor((Math.random() * maxLevel) + 1);

    yield new allowedTypes[typeRandom](levelRandom);
  }
}

export function* characterGeneratorforBad(allowedTypes, maxLevel) {
  // TODO: write logic here
  allowedTypes = [Vampire, Undead, Daemon];
  while (true) {
    const typeRandom = Math.floor(Math.random() * allowedTypes.length);
    const levelRandom = Math.floor((Math.random() * maxLevel) + 1);

    yield new allowedTypes[typeRandom](levelRandom);
  }
}

// export function* characterGenerator(allowedTypes, maxLevel) {
//   // TODO: write logic here
// }

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */

export function generateGoodTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const characters = [];

  for (let i = 0; i < characterCount; i++) {
    characters.push(characterGeneratorforGood(allowedTypes, maxLevel).next().value);
  }

  return characters;
}

export function generateBadTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const characters = [];

  for (let i = 0; i < characterCount; i++) {
    characters.push(characterGeneratorforBad(allowedTypes, maxLevel).next().value);
  }

  return characters;
}
