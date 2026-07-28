const MAX_ATTEMPTS = 4;
const GAME_KEY = 'oiseaux-photo';
let progress = loadProgress(GAME_KEY);

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
const inputEl = document.getElementById('answer-input');
const feedbackEl = document.getElementById('feedback');
const attemptCountEl = document.getElementById('attempt-count');
const submitBtn = document.getElementById('submit-btn');

function nextRound() {
  currentBird = pickNextBird(currentBird ? currentBird.id : null);
  attemptsLeft = MAX_ATTEMPTS;
  photoEl.src = currentBird.image;
  inputEl.value = '';
  feedbackEl.textContent = '';
  attemptCountEl.textContent = 1;
  inputEl.focus();
}

function handleSubmit() {
  if (!currentBird) return;
  const answer = inputEl.value.trim();
  if (!answer) return;

  if (isCloseEnough(answer, currentBird.name)) {
    const state = getBirdState(currentBird.id);
    state.box = Math.min(5, state.box + 1);
    saveProgress(GAME_KEY, progress);
    feedbackEl.textContent = `Bravo ! C'était bien "${currentBird.name}".`;
    submitBtn.disabled = true;
    setTimeout(() => { submitBtn.disabled = false; nextRound(); }, 1200);
    return;
  }
  attemptsLeft--;
  if (attemptsLeft <= 0) {
    const state = getBirdState(currentBird.id);
    state.box = 1;
    saveProgress(GAME_KEY, progress);
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