const board = document.getElementById('board');
const cells = [];
const gameState = Array(9).fill('');
let currentPlayer = 'X';
let playerMarker = 'X';
let isSinglePlayer = false;

let markerChosen = false;
let modeChosen = false;

const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');

const modal = document.getElementById('resultModal');
const modalText = document.getElementById('modalText');
const closeModalBtn = document.getElementById('closeModal');
const sadEffect = document.getElementById('sadEffect');

// Initialize board
function initBoard() {
  board.innerHTML = '';
  cells.length = 0;
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', (e) => handleClick(e, i));
    board.appendChild(cell);
    cells.push(cell);
  }
}

// Reset active states for marker buttons
function resetMarkerButtons() {
  document.getElementById('btnX').classList.remove('active');
  document.getElementById('btnO').classList.remove('active');
}

// Reset active states for mode buttons
function resetModeButtons() {
  document.getElementById('btnSingle').classList.remove('active');
  document.getElementById('btnMulti').classList.remove('active');
}

// Marker selection
function chooseMarker(marker, btn) {
  playerMarker = marker;
  currentPlayer = 'X';
  resetBoard();

  resetMarkerButtons();
  btn.classList.add('active');
  markerChosen = true;
}

// Mode selection
function setMode(mode, btn) {
  isSinglePlayer = (mode === 'single');
  resetBoard();

  resetModeButtons();
  btn.classList.add('active');
  modeChosen = true;
}

// Handle cell click
function handleClick(e, index) {
  if (!markerChosen || !modeChosen) {
    alert("Please choose your marker and game mode first!");
    return;
  }

  if (gameState[index]) return;
  if (isSinglePlayer && currentPlayer !== playerMarker) return;

  gameState[index] = currentPlayer;
  renderBoard();

  const winCombo = checkWin(currentPlayer);
  if (winCombo) {
    if (currentPlayer === playerMarker) celebrate("You Win!", "happy");
    else celebrate("You Lose!", "sad");
    updateScores(currentPlayer);
    return;
  }
  if (checkDraw()) { celebrate("It's a Draw!", "neutral"); return; }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  if (isSinglePlayer && currentPlayer !== playerMarker) aiMove();
}

// AI move
function aiMove() {
  const empty = gameState.map((v, i) => v === '' ? i : null).filter(v => v !== null);
  const choice = empty[Math.floor(Math.random() * empty.length)];
  gameState[choice] = currentPlayer;
  renderBoard();

  const winCombo = checkWin(currentPlayer);
  if (winCombo) {
    celebrate("You Lose!", "sad");
    updateScores(currentPlayer);
    return;
  }
  if (checkDraw()) { celebrate("It's a Draw!", "neutral"); return; }

  currentPlayer = playerMarker;
}

// Render board
function renderBoard() {
  gameState.forEach((val, i) => cells[i].textContent = val);
}

// Check winner
function checkWin(player) {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return combos.find(c => c.every(i => gameState[i] === player)) || null;
}

// Check draw
function checkDraw() {
  return gameState.every(cell => cell !== '');
}

// Update scores
function updateScores(player) {
  if (player === 'X') scoreX.textContent = parseInt(scoreX.textContent) + 1;
  else scoreO.textContent = parseInt(scoreO.textContent) + 1;
}

// Celebration
function celebrate(message, type = "neutral") {
  modalText.textContent = message;
  modal.classList.add('show');

  if (type === "happy") {
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 300);
  }

  if (type === "sad") {
    for (let i = 0; i < 15; i++) {
      const tear = document.createElement('div');
      tear.classList.add('tear');
      tear.style.left = Math.random() * 100 + "%";
      tear.style.animationDelay = (Math.random() * 1.5) + "s";
      sadEffect.appendChild(tear);
      tear.addEventListener('animationend', () => tear.remove());
    }
  }
}

// Close modal
closeModalBtn.onclick = () => {
  modal.classList.remove('show');
  setTimeout(resetBoard, 500);
};

// Reset board
function resetBoard() {
  gameState.fill('');
  renderBoard();
  sadEffect.innerHTML = "";
}

initBoard();