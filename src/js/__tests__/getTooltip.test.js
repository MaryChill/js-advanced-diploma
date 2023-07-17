import Bowman from '../characters/Bowman';
import getTooltip from '../getTooltip';

test('test of getTooltip', () => {
  const bowman = new Bowman(1);
  expect(getTooltip(bowman)).toBe('🎖1 ⚔25 🛡25 ❤50');
});
