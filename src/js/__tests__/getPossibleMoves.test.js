import getPossibleMoves from '../getPossibleMoves';

test('test-1 of getPossibleMoves', () => {
  const arrOfPossibleMoves = getPossibleMoves(8, 0, 1, 4)[0];
  const correct = [8, 1, 9];

  expect(arrOfPossibleMoves).toEqual(correct);
});

test('test-2 of getPossibleMoves', () => {
  const arrOfPossibleMoves = getPossibleMoves(10, 31, 2, 2)[0];
  const correct = [
    11, 21, 30, 40, 20, 41,
    32, 22, 42, 51, 33, 13,
    53,
  ];

  expect(arrOfPossibleMoves).toEqual(correct);
});

test('test-3 of getPossibleMoves', () => {
  const arrOfPossibleMoves = getPossibleMoves(6, 12, 1, 4);
  const correct = [
    [6, 18, 13, 7, 19],
    [
      0, 1, 2, 3, 4, 6, 7, 8, 9,
      10, 13, 14, 15, 16, 18, 19, 20, 21,
      22, 24, 25, 26, 27, 28, 30, 31, 32,
      33, 34,
    ],
  ];

  expect(arrOfPossibleMoves).toEqual(correct);
});
