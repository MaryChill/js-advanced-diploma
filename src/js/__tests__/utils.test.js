import { calcTileType } from '../utils';

test.each([
  ['test of calcTileType top-left', [0, 8], 'top-left'],
  ['test of calcTileType top-right', [6, 7], 'top-right'],
  ['test of calcTileType bottom-left', [6, 3], 'bottom-left'],
  ['test of calcTileType bottom-right', [15, 4], 'bottom-right'],
  ['test of calcTileType top', [1, 5], 'top'],
  ['test of calcTileType bottom', [47, 7], 'bottom'],
  ['test of calcTileType right', [5, 3], 'right'],
  ['test of calcTileType left', [8, 8], 'left'],
  ['test of calcTileType center', [7, 5], 'center'],
])('%s', (nameOfTest, args, correct) => {
  expect(calcTileType(...args)).toBe(correct);
});
