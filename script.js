const gameBoard = document.getElementById("game-board");
const statusText = document.getElementById("status");
const moveSound = document.getElementById("moveSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = false;
let vsAI = false;

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function setMode(mode) {
  vsAI = mode === 'AI';
  resetGame();
  statusText.textContent = vsAI ? "Player X vs AI (O)" : "Player X's Turn";
  gameActive = true;
}

function createBoard() {
  gameBoard.innerHTML = "";
  board.forEach((_, i) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    gameBoard.appendChild(cell);
  });
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index]) return;

  makeMove(index, currentPlayer);
  moveSound.play();

  if (checkWinner(currentPlayer)) {
    statusText.textContent = `🎉 Player ${currentPlayer} Wins!`;
    winSound.play();
    gameActive = false;
  } else if (board.every(cell => cell !== "")) {
    statusText.textContent = "😐 It's a Draw!";
    drawSound.play();
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = vsAI && currentPlayer === "O" ? "AI's Turn..." : `Player ${currentPlayer}'s Turn`;

    if (vsAI && currentPlayer === "O" && gameActive) {
      setTimeout(() => {
        aiMove();
      }, 500);
    }
  }
}

function makeMove(index, player) {
  board[index] = player;
  const cell = document.querySelectorAll(".cell")[index];
  cell.textContent = player;
  cell.classList.add(player);
}

function checkWinner(player) {
  return winConditions.some(condition => 
    condition.every(index => board[index] === player)
  );
}

function aiMove() {
  const emptyIndices = board
    .map((val, idx) => val === "" ? idx : null)
    .filter(i => i !== null);
  
  // Simple random AI move
  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(randomIndex, "O");
  moveSound.play();

  if (checkWinner("O")) {
    statusText.textContent = `🤖 AI Wins!`;
    winSound.play();
    gameActive = false;
  } else if (board.every(cell => cell !== "")) {
    statusText.textContent = "😐 It's a Draw!";
    drawSound.play();
    gameActive = false;
  } else {
    currentPlayer = "X";
    statusText.textContent = "Player X's Turn";
  }
}

function resetGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = false;
  statusText.textContent = "Choose a mode to start";
  createBoard();
}

createBoard();
 