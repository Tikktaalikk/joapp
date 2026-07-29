const MAX_ATTEMPTS = 4;
const GAME_KEY = 'oiseaux-photo';
const SESSION_LENGTH = 10;
const SESSION_STATS_KEY = 'oiseaux-photo-sessions';
const BOX_COLORS = { 1: '#e53935', 2: '#fb8c00', 3: '#eafb2d', 4: '#43a047', 5: '#4285f4' };

BIRDS.forEach((bird) => {
  bird.images.forEach((url) => {
    const preloadImg = new Image();
    preloadImg.src = url;
  });
});

let progress = loadProgress(GAME_KEY);
let sessionStats = loadProgress(SESSION_STATS_KEY);
if (typeof sessionStats.count !== 'number') {
  sessionStats = { count: 0, totalXp: 0, totalDurationMs: 0 };
}
let sessionStartTime = Date.now();
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

function formatDuration(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return m > 0 ? `${m} min ${String(s).padStart(2, '0')} s` : `${s} s`;
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
 photoEl.src = currentBird.images[Math.floor(Math.random() * currentBird.images.length)];
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

  const durationMs = Date.now() - sessionStartTime;
  sessionStats.count += 1;
  sessionStats.totalXp += sessionXp;
  sessionStats.totalDurationMs += durationMs;
  saveProgress(SESSION_STATS_KEY, sessionStats);

  const thisDurationSec = Math.round(durationMs / 1000);
  const avgDurationSec = Math.round((sessionStats.totalDurationMs / sessionStats.count) / 1000);
  const avgXp = Math.round(sessionStats.totalXp / sessionStats.count);

  document.getElementById('session-recap').innerHTML = `
    <p>Tu as gagné ${sessionXp} XP sur ${SESSION_LENGTH} oiseaux (${sessionCorrectFirstTry} du premier coup).</p>
    <p>Temps pour cette session : ${formatDuration(thisDurationSec)}</p>
    <p>Temps moyen par session : ${formatDuration(avgDurationSec)}</p>
    <p>XP moyen par session : ${avgXp}</p>
  `;
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

    feedbackEl.textContent = `+${xpGained} XP`;
    submitBtn.disabled = true;
    setTimeout(() => { submitBtn.disabled = false; nextRound(); }, 600);
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