import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Character from '../Character';

test('test new class Character', () => {
  expect(() => {
    new Character(1);
  }).toThrow();
});

test('test new class Bowman', () => {
  const bowman = new Bowman(1);

  const correct = {
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    possibleAttacks: 2,
    possibleMoves: 2,
    type: 'bowman',
  };
  expect(bowman).toEqual(correct);
});

test('test new class Daemon', () => {
  const daemon = new Daemon(2);

  const correct = {
    level: 2,
    attack: 10,
    defence: 10,
    health: 50,
    possibleAttacks: 4,
    possibleMoves: 1,
    type: 'daemon',
  };
  expect(daemon).toEqual(correct);
});

test('test new class Magician', () => {
  const magician = new Magician(1);

  const correct = {
    level: 1,
    attack: 10,
    defence: 40,
    health: 50,
    possibleAttacks: 4,
    possibleMoves: 1,
    type: 'magician',
  };
  expect(magician).toEqual(correct);
});
