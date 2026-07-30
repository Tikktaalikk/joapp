const MAX_ATTEMPTS = 3;
const GAME_KEY = 'oiseaux-photo';
const SESSION_LENGTH = 20;
const SESSION_STATS_KEY = 'oiseaux-photo-sessions';
const BOX_COLORS = { 1: '#e53935', 2: '#fb8c00', 3: '#fbc02d', 4: '#43a047', 5: '#4285f4' };

BIRDS.forEach((bird) => {
  bird.images.forEach((url) => {
    const preloadImg = new Image();
    preloadImg.src = url;
  });
});

let progress = loadProgress(GAME_KEY);
let sessionStats = loadProgress(SESSION_STATS_KEY);
if (typeof sessionStats.count !== 'number') {
  sessionStats = { count: 0, totalXp: 0, totalDurationMs: 0, bestScore: 0 };
}
if (typeof sessionStats.bestScore !== 'number') {
  sessionStats.bestScore = 0;
}
let sessionStartTime = Date.now();
let roundsPlayed = 0;
let sessionXp = 0;
let sessionCorrectFirstTry = 0;
let sessionCorrectTotal = 0;
let roundResults = [];

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
  return m > 0 ? `${m}m${String(s).padStart(2, '0')}s` : `${s}s`;
}

function renderRoundRow(result) {
  let nameClass = 'missed';
  if (result.correct) {
    nameClass = result.heartsLost === 0 ? 'correct-first' : 'correct-retry';
  }
  let heartsHtml = '';
  for (let i = 1; i <= MAX_ATTEMPTS; i++) {
    heartsHtml += `<span class="mini-heart ${i <= result.heartsLost ? 'lost' : ''}">♥</span>`;
  }
  return `<li class="round-row"><span class="round-name ${nameClass}">${result.name}</span><span class="round-hearts">${heartsHtml}</span></li>`;
}

let currentBird = null;
let attemptsLeft = MAX_ATTEMPTS;
const photoWrapperEl = document.getElementById('photo-wrapper');
const photoEl = document.getElementById('bird-photo');
const badgeEl = document.getElementById('box-badge');
const checkOverlayEl = document.getElementById('check-overlay');
const heartEls = document.querySelectorAll('#hearts .heart');
const roundCounterEl = document.getElementById('round-counter');
const timerEl = document.getElementById('session-timer');
const inputEl = document.getElementById('answer-input');
const feedbackEl = document.getElementById('feedback');
const submitBtn = document.getElementById('submit-btn');
const skipBtn = document.getElementById('skip-btn');

const timerInterval = setInterval(() => {
  const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
  timerEl.textContent = formatDuration(elapsed);
}, 1000);

function resetHearts() {
  heartEls.forEach((h) => h.classList.remove('lost', 'losing'));
}

function loseHeart(index) {
  const heart = heartEls[index - 1];
  if (!heart) return;
  heart.classList.add('lost', 'losing');
  setTimeout(() => heart.classList.remove('losing'), 300);
}

function nextRound() {
  if (roundsPlayed >= SESSION_LENGTH) {
    showSessionEnd();
    return;
  }
  currentBird = pickNextBird(currentBird ? currentBird.id : null);
  attemptsLeft = MAX_ATTEMPTS;
  photoEl.src = currentBird.images[Math.floor(Math.random() * currentBird.images.length)];
  badgeEl.style.background = BOX_COLORS[getBirdState(currentBird.id).box];
  resetHearts();
  checkOverlayEl.classList.remove('show');
  roundCounterEl.textContent = `${roundsPlayed + 1}/${SESSION_LENGTH}`;
  inputEl.value = '';
  feedbackEl.textContent = '';
  inputEl.focus();
}

function revealAndAdvance() {
  const state = getBirdState(currentBird.id);
  state.box = 1;
  saveProgress(GAME_KEY, progress);
  roundResults.push({ name: currentBird.name, heartsLost: MAX_ATTEMPTS, correct: false });
  roundsPlayed++;
  feedbackEl.textContent = `C'était "${currentBird.name}".`;
  photoWrapperEl.classList.add('flash-wrong');
  setTimeout(() => photoWrapperEl.classList.remove('flash-wrong'), 500);
  submitBtn.disabled = true;
  skipBtn.disabled = true;
  setTimeout(() => { submitBtn.disabled = false; skipBtn.disabled = false; nextRound(); }, 1600);
}

function showSessionEnd() {
  clearInterval(timerInterval);
  document.getElementById('quiz').style.display = 'none';
  const endEl = document.getElementById('session-end');
  endEl.style.display = 'block';
  endEl.classList.add('session-end-visible');

  const durationMs = Date.now() - sessionStartTime;
  sessionStats.count += 1;
  sessionStats.totalXp += sessionXp;
  sessionStats.totalDurationMs += durationMs;
  if (sessionCorrectTotal > sessionStats.bestScore) {
    sessionStats.bestScore = sessionCorrectTotal;
  }
  saveProgress(SESSION_STATS_KEY, sessionStats);

  const thisDurationSec = Math.round(durationMs / 1000);
  const avgDurationSec = Math.round((sessionStats.totalDurationMs / sessionStats.count) / 1000);
  const avgXp = Math.round(sessionStats.totalXp / sessionStats.count);

  document.getElementById('session-recap').innerHTML = `
    <p>Score : ${sessionCorrectTotal}/${SESSION_LENGTH} — Meilleur score (PB) : ${sessionStats.bestScore}/${SESSION_LENGTH}</p>
    <p>Tu as gagné ${sessionXp} XP (${sessionCorrectFirstTry} oiseaux trouvés du premier coup).</p>
    <p>Temps pour cette session : ${formatDuration(thisDurationSec)}</p>
    <p>Temps moyen par session : ${formatDuration(avgDurationSec)}</p>
    <p>XP moyen par session : ${avgXp}</p>
    <div id="round-details">
      <h3>Réponses</h3>
      <ul id="round-list">${roundResults.map(renderRoundRow).join('')}</ul>
    </div>
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
    const xpGained = [10, 7, 5][attemptNumber - 1] || 5;
    addXp(xpGained);
    recordDailyActivity();
    renderStats();

    sessionXp += xpGained;
    sessionCorrectTotal++;
    if (attemptNumber === 1) sessionCorrectFirstTry++;
    roundResults.push({ name: currentBird.name, heartsLost: attemptNumber - 1, correct: true });
    roundsPlayed++;

    feedbackEl.textContent = `+${xpGained} XP`;
    checkOverlayEl.classList.add('show');
    submitBtn.disabled = true;
    skipBtn.disabled = true;
    setTimeout(() => { submitBtn.disabled = false; skipBtn.disabled = false; nextRound(); }, 600);
    return;
  }

  attemptsLeft--;
  const heartIndexLost = MAX_ATTEMPTS - attemptsLeft;
  loseHeart(heartIndexLost);

  if (attemptsLeft <= 0) {
    revealAndAdvance();
  } else {
    feedbackEl.textContent = 'Pas tout à fait, réessaie.';
    inputEl.classList.add('shake');
    setTimeout(() => inputEl.classList.remove('shake'), 300);
  }
}

submitBtn.addEventListener('click', handleSubmit);
skipBtn.addEventListener('click', () => {
  if (!currentBird) return;
  revealAndAdvance();
});
inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSubmit(); });
nextRound();