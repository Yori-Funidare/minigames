const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const modalOverlay = document.getElementById('modalOverlay');
const finalScoreSpan = document.getElementById('finalScore');
const playAgainBtn = document.getElementById('playAgainBtn');
const quitBtn = document.getElementById('quitBtn');

let score = 0;
let timeLeft = 30;
let gameInterval;
let gameActive = false;
let dot;

function spawnDot() {
  if (dot) dot.remove();
  dot = document.createElement('div');
  dot.className = 'dot';
  const maxX = gameArea.clientWidth - 40;
  const maxY = gameArea.clientHeight - 40;
  dot.style.left = Math.random() * maxX + 'px';
  dot.style.top = Math.random() * maxY + 'px';
  dot.addEventListener('click', (e) => {
    if (!gameActive) return;
    score++;
    scoreDisplay.textContent = score;
    createParticles(e.clientX, e.clientY);
    spawnDot();
  });
  gameArea.appendChild(dot);
}

function createParticles(x, y) {
  const rect = gameArea.getBoundingClientRect();
  const originX = x - rect.left;
  const originY = y - rect.top;

  for(let i=0; i<12; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = originX + 'px';
    p.style.top = originY + 'px';
    gameArea.appendChild(p);

    const angle = Math.random() * 2 * Math.PI;
    const distance = 20 + Math.random() * 40;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    const duration = 600 + Math.random() * 400;

    p.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 0.9 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.5)`, opacity: 0 }
    ], { duration: duration, easing: 'ease-out' });

    setTimeout(() => {
      p.remove();
    }, duration);
  }
}

function startGame() {
  if (gameActive) return;
  gameActive = true;
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  modalOverlay.classList.remove('active');
  spawnDot();
  gameInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameActive = false;
  clearInterval(gameInterval);
  if (dot) dot.remove();
  finalScoreSpan.textContent = score;
  modalOverlay.classList.add('active');
}

function resetGame() {
  gameActive = false;
  clearInterval(gameInterval);
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  if (dot) dot.remove();
  modalOverlay.classList.remove('active');
}

playAgainBtn.addEventListener('click', () => {
  startGame();
});

quitBtn.addEventListener('click', () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = 'about:blank';
  }
});