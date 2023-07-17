export default function getPossibleMoves(boardSize, position, possibleMoves, possibleAttacks) {
  const field = [];
  let row = 0;
  let column = 0;

  for (let i = 0; i < boardSize; i += 1) {
    field[i] = [];
    for (let j = 0; j < boardSize; j += 1) {
      field[i][j] = (boardSize * i) + j;

      if (field[i][j] === position) {
        row = i;
        column = j;
      }
    }
  }

  let arrOfPossibleMoves = [];

  for (let i = -possibleMoves; i <= possibleMoves; i += 1) {
    if (row + i >= 0 && row + i < boardSize) {
      arrOfPossibleMoves.push(field[row + i][column]);
    }

    if (column + i >= 0 && column + i < boardSize) {
      arrOfPossibleMoves.push(field[row][column + i]);
    }

    if (row - i >= 0 && row - i < boardSize && column + i >= 0 && column + i < boardSize) {
      arrOfPossibleMoves.push(field[row - i][column + i]);
    }

    if (row + i >= 0 && row + i < boardSize && column + i >= 0 && column + i < boardSize) {
      arrOfPossibleMoves.push(field[row + i][column + i]);
    }
  }

  let topLeft = null;
  let bottomRight = null;

  for (let i = -possibleAttacks; i <= possibleAttacks; i += 1) {
    if (topLeft === null) {
      topLeft = [row + i, column + i];
    }
    bottomRight = [row + i, column + i];
  }

  function removeOutsideCells(...cells) {
    const arr = [];
    cells.forEach((cell) => {
      if (cell < 0) {
        arr.push(0);
      } else if (cell >= boardSize) {
        arr.push(boardSize - 1);
      } else {
        arr.push(cell);
      }
    });
    return arr;
  }

  topLeft = removeOutsideCells(...topLeft);
  bottomRight = removeOutsideCells(...bottomRight);

  let arrOfPossibleAttacks = [];

  for (let i = topLeft[0]; i <= bottomRight[0]; i += 1) {
    for (let j = topLeft[1]; j <= bottomRight[1]; j += 1) {
      arrOfPossibleAttacks.push(field[i][j]);
    }
  }

  arrOfPossibleMoves = arrOfPossibleMoves.filter((el) => position !== el);
  arrOfPossibleAttacks = arrOfPossibleAttacks.filter((el) => position !== el);

  console.log('arrOfPossibleMoves');
  console.log(arrOfPossibleMoves);
  console.log('arrOfPossibleAttacks');
  console.log(arrOfPossibleAttacks);

  return [arrOfPossibleMoves, arrOfPossibleAttacks];
}
