const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = ["O", "J", "L", "T", "I", "H", "Z"];
let playfield;
let tetromino;

const TETROMINOES = {
  O: [
    [1, 1],
    [1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  I: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  H: [
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

let isActiveGame = false;
let showRotated = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

function rundomNumber() {
  return Math.floor(Math.random() * TETROMINO_NAMES.length);
}

function convertPositionToIndex(row, column) {
  return row * PLAYFIELD_COLUMNS + column;
}

function generatePlayFields() {
  for (let i = 0; i < PLAYFIELD_COLUMNS * PLAYFIELD_ROWS; i++) {
    const div = document.createElement(`div`);
    document.querySelector(".grid").append(div);
  }

  playfield = new Array(PLAYFIELD_ROWS)
    .fill()
    .map(() => new Array(PLAYFIELD_COLUMNS).fill());
}

function generateTetroMino() {
  const elementNumber = rundomNumber();
  const startColumnPosition = Math.floor(
    (PLAYFIELD_COLUMNS - TETROMINO_NAMES[elementNumber].length) / 2
  );

  const name = TETROMINO_NAMES[elementNumber];
  const matrix = TETROMINOES[name];

  tetromino = {
    name: TETROMINO_NAMES[elementNumber],
    matrix,
    row: 0,
    column: startColumnPosition,
  };
}

function placeTetramino() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (tetromino.matrix[row][column]) {
        playfield[tetromino.row + row][tetromino.column + column] =
          tetromino.name;
      }
    }
  }
  generateTetroMino();
}

generatePlayFields();
generateTetroMino();

const cells = document.querySelectorAll(".grid div");

function drawPlayFields() {
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
      if (playfield[row][column] === 0) {
        continue;
      }
      const name = playfield[row][column];
      const cellIndex = convertPositionToIndex(row, column);
      cells[cellIndex].classList.add(name);
    }
  }
}

function drowTetroMino() {
  const name = tetromino.name;
  const tetraminoMatrixSize = tetromino.matrix.length;
  for (let row = 0; row < tetraminoMatrixSize; row++) {
    for (let column = 0; column < tetraminoMatrixSize; column++) {
      // cells[cellIndex].innerHTML = showRotated[row][column];

      if (!tetromino.matrix[row][column]) {
        continue;
      }
      const cellIndex = convertPositionToIndex(
        tetromino.row + row,
        tetromino.column + column
      );

      cells[cellIndex].classList.add(name);
    }
  }
}

function draw() {
  cells.forEach((cell) => cell.removeAttribute("class"));
  drawPlayFields();
  drowTetroMino();
}
draw();

document.addEventListener("keydown", onKeyDown);

function onKeyDown(e) {
  switch (e.key) {
    case "ArrowUp":
      rotate();
      break;
    case "ArrowDown":
      moveTetrominoDown();
      break;
    case "ArrowLeft":
      moveTetrominoLeft();
      break;
    case "ArrowRight":
      moveTetrominoRight();
      break;
  }
  draw();
}

function rotate() {
  isActiveGame && rotateTetromino();
  draw();
}

function rotateTetromino() {
  const oldMatrix = tetromino.matrix;
  const rotatedMatrix = rotateMatrix(tetromino.matrix);
  showRotated = rotateMatrix(showRotated);
  tetromino.matrix = rotatedMatrix;

  if (!isValid()) {
    tetromino.matrix = oldMatrix;
  }
}

function rotateMatrix(matrixTetramino) {
  const N = matrixTetramino.length;
  const rotateMatrix = [];
  for (let i = 0; i < N; i++) {
    rotateMatrix[i] = [];
    for (let j = 0; j < N; j++) {
      rotateMatrix[i][j] = matrixTetramino[N - j - 1][i];
    }
  }
  return rotateMatrix;
}
function moveTetrominoDown() {
  if (isActiveGame) {
    tetromino.row += 1;
    if (!isValid()) {
      tetromino.row -= 1;
      placeTetramino();
    }
    draw();
  }
}

let intervalId;

function continiusMovedTetrominoDown() {
  intervalId = setInterval(() => {
    isActiveGame = true;
    moveTetrominoDown();
    draw();
  }, 300);
}

function startGame() {
  continiusMovedTetrominoDown();
}

function stopGame() {
  isActiveGame = false;
  clearInterval(intervalId);
}
function clearGame() {
  playfield = new Array(PLAYFIELD_ROWS)
    .fill()
    .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
  generateTetroMino();
}

function restartGame() {
  stopGame();
  clearGame();
  startGame();
}

function moveTetrominoLeft() {
  if (isActiveGame) {
    tetromino.column -= 1;
    if (!isValid()) {
      tetromino.column += 1;
    }
    draw();
  }
}

function moveTetrominoRight() {
  if (isActiveGame) {
    tetromino.column += 1;
    if (!isValid()) {
      tetromino.column -= 1;
    }
    draw();
  }
}

function isValid() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      // if (tetromino.matrix[row][column]) continue;
      if (isOutsideOfGameBoard(row, column)) {
        return false;
      }
      if (hasCollisions(row, column)) {
        return false;
      }
    }
  }
  return true;
}
function isOutsideOfGameBoard(row, column) {
  return (
    tetromino.matrix[row][column] &&
    (tetromino.column + column < 0 ||
      tetromino.column + column >= PLAYFIELD_COLUMNS ||
      tetromino.row + row >= PLAYFIELD_ROWS)
  );
}

function hasCollisions(row, column) {
  return (
    tetromino.matrix[row][column] &&
    playfield[tetromino.row + row][tetromino.column + column]
  );
}
