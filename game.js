const MAX_ATTEMPTS = 4;
const STORAGE_KEY = 'joapp_progress';

// Mémorise, pour chaque oiseau, sa "box" (1 = pas connu, 5 = bien connu)
function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}
function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
let progress = loadProgress();
function getBirdState(id) {
  if (!progress[id]) progress[id] = { box: 1 };
  return progress[id];
}

// Choisit le prochain oiseau : plus sa box est basse, plus il a de chances d'apparaître
// (mais les oiseaux bien connus reviennent quand même de temps en temps)
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

// Vérifie la réponse en ignorant accents/majuscules et en tolérant 1-2 fautes de frappe
function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s-]/g, '').trim().replace(/\s+/g, ' ');
}
function levenshtein(a, b) {
  const m = [];
  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
        ? m[i - 1][j - 1]
        : Math.min(m[i - 1][j - 1] + 1, m[i][j - 1] + 1, m[i - 1][j] + 1);
    }
  }
  return m[b.length][a.length];
}
function isCloseEnough(input, target) {
  const a = normalize(input), b = normalize(target);
  if (a === b) return true;
  const tolerance = b.length <= 5 ? 1 : Math.floor(b.length / 6) + 1;
  return levenshtein(a, b) <= tolerance;
}

// Déroulement d'une manche
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
    saveProgress(progress);
    feedbackEl.textContent = `Bravo ! C'était bien "${currentBird.name}".`;
    submitBtn.disabled = true;
    setTimeout(() => { submitBtn.disabled = false; nextRound(); }, 1200);
    return;
  }
  attemptsLeft--;
  if (attemptsLeft <= 0) {
    const state = getBirdState(currentBird.id);
    state.box = 1;
    saveProgress(progress);
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