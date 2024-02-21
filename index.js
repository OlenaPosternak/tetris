const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = ["O", "J", "L", "K", "M", "I"];
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
  K: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  M: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
  I: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

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
    row: 1,
    column: startColumnPosition,
  };
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

function moveTetrominoDown() {
  tetromino.row += 1;
}
function moveTetrominoLeft() {
  tetromino.column -= 1;
}
function moveTetrominoRight() {
  tetromino.column += 1;
}
