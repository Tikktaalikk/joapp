const MAX_ATTEMPTS = 4;
const GAME_KEY = 'oiseaux-photo';
const SESSION_LENGTH = 10;
const BOX_COLORS = { 1: '#4285f4', 2: '#43a047', 3: '#fbc02d', 4: '#fb8c00', 5: '#e53935' };

BIRDS.forEach((bird) => {
  const preloadImg = new Image();
  preloadImg.src = bird.image;
});

let progress = loadProgress(GAME_KEY);
let roundsPlayed = 0;
let sessionXp = 0;
let sessionCorrectFirstTry = 0;

function getBirdState(id) {
  if (!progress[id]) progress[id] = { box: 1 };
  return progress[id];
}

function pickNextBird(excludeId) {
  const candidates = BIRDS.filter(b => b.id !== excludeId);
  const weights = candidates.map(b => 6 - getBirdState(b.id).box);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

let currentBird = null;
let attemptsLeft = MAX_ATTEMPTS;
const photoEl = document.getElementById('bird-photo');
const badgeEl = document.getElementById('box-badge');
const inputEl = document.getElementById('answer-input');
const feedbackEl = document.getElementById('feedback');
const attemptCountEl = document.getElementById('attempt-count');
const submitBtn = document.getElementById('submit-btn');

function nextRound() {
  if (roundsPlayed >= SESSION_LENGTH) {
    showSessionEnd();
    return;
  }
  currentBird = pickNextBird(currentBird ? currentBird.id : null);
  attemptsLeft = MAX_ATTEMPTS;
  photoEl.src = currentBird.image;
  badgeEl.style.background = BOX_COLORS[getBirdState(currentBird.id).box];
  inputEl.value = '';
  feedbackEl.textContent = '';
  attemptCountEl.textContent = 1;
  inputEl.focus();
}

function showSessionEnd() {
  document.getElementById('quiz').style.display = 'none';
  const endEl = document.getElementById('session-end');
  endEl.style.display = 'block';
  document.getElementById('session-recap').textContent =
    `Tu as gagné ${sessionXp} XP sur ${SESSION_LENGTH} oiseaux (${sessionCorrectFirstTry} du premier coup).`;
}

function handleSubmit() {
  if (!currentBird) return;
  const answer = inputEl.value.trim();
  if (!answer) return;

  if (isCloseEnough(answer, currentBird.name)) {
    const state = getBirdState(currentBird.id);
    state.box = Math.min(5, state.box + 1);
    saveProgress(GAME_KEY, progress);

    const attemptNumber = MAX_ATTEMPTS - attemptsLeft + 1;
    const xpGained = [10, 7, 5, 3][attemptNumber - 1] || 3;
    addXp(xpGained);
    recordDailyActivity();
    renderStats();

    sessionXp += xpGained;
    if (attemptNumber === 1) sessionCorrectFirstTry++;
    roundsPlayed++;

    feedbackEl.textContent = '';
    submitBtn.disabled = true;
    setTimeout(() => { submitBtn.disabled = false; nextRound(); }, 1200);
    return;
  }

  attemptsLeft--;
  if (attemptsLeft <= 0) {
    const state = getBirdState(currentBird.id);
    state.box = 1;
    saveProgress(GAME_KEY, progress);
    roundsPlayed++;
    feedbackEl.textContent = `Dommage, c'était "${currentBird.name}".`;
    submitBtn.disabled = true;
    setTimeout(() => { submitBtn.disabled = false; nextRound(); }, 1600);
  } else {
    feedbackEl.textContent = 'Pas tout à fait, réessaie.';
    attemptCountEl.textContent = MAX_ATTEMPTS - attemptsLeft + 1;
  }
}

submitBtn.addEventListener('click', handleSubmit);
inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSubmit(); });
nextRound();