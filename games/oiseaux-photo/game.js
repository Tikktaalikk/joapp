const MAX_ATTEMPTS = 3;
const GAME_KEY = 'oiseaux-photo';
const SESSION_LENGTH = 20;
const SESSION_STATS_KEY = 'oiseaux-photo-sessions';
const BOX_COLORS = { 1: '#e53935', 2: '#fb8c00', 3: '#fbc02d', 4: '#43a047', 5: '#4285f4' };

const CORRECT_PHRASES = ['Bien joué', 'Nickel', 'Pile dans le mille', 'Exact', 'Joli coup', 'Parfait', 'Bien vu'];
const WRONG_RETRY_PHRASES = ['Pas tout à fait, réessaie.', 'Presque !', 'Pas cette fois, retente.', 'Encore un essai !', 'Pas ça...'];
const LOSS_PHRASES = ['Dommage, c\'était', 'Pas grave, c\'était', 'Ce sera pour une prochaine fois : c\'était', 'Aïe, c\'était'];
const SKIP_PHRASES = ['C\'était', 'Pas de souci, c\'était', 'Bonne question ! C\'était', 'Pour info, c\'était'];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const urlParams = new URLSearchParams(window.location.search);
const selectedLot = urlParams.get('lot') ? Number(urlParams.get('lot')) : null;
const ACTIVE_BIRDS = selectedLot ? BIRDS.filter((b) => b.lot === selectedLot) : BIRDS;

ACTIVE_BIRDS.forEach((bird) => {
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
let sessionEnded = false;

function getBirdState(id) {
  if (!progress[id]) progress[id] = { box: 1 };
  return progress[id];
}

function pickNextBird(excludeId) {
  const candidates = ACTIVE_BIRDS.filter(b => b.id !== excludeId);
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

function maskWord(word) {
  let revealed = false;
  return word.split('').map((char) => {
    if (/[a-zA-ZÀ-ÿ]/.test(char)) {
      if (!revealed) { revealed = true; return char; }
      return '_';
    }
    return char;
  }).join('');
}

function updateHintDisplay() {
  const words = currentBird.name.split(' ');
  const parts = words.map((word, i) => {
    if (revealedWordsFull[i]) return word;
    if (hintUsed) return maskWord(word);
    return '';
  }).filter((w) => w !== '');
  hintDisplayEl.textContent = parts.join(' ');
}

function checkPartialWordMatch(answer) {
  const targetWords = currentBird.name.split(' ');
  const answerWords = answer.trim().split(/\s+/);
  let changed = false;
  targetWords.forEach((tWord, i) => {
    if (revealedWordsFull[i]) return;
    const tNorm = normalize(tWord);
    if (!tNorm) return;
    const found = answerWords.some((aWord) => normalize(aWord) === tNorm);
    if (found) {
      revealedWordsFull[i] = true;
      changed = true;
    }
  });
  if (changed) updateHintDisplay();
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
  return `<li class="round-row">
    <span class="round-name-group">
      <span class="round-name ${nameClass}">${result.name}</span>
      <a class="wiki-link" href="${result.wiki}" target="_blank" rel="noopener">Wikipédia</a>
    </span>
    <span class="round-hearts">${heartsHtml}</span>
  </li>`;
}

let currentBird = null;
let attemptsLeft = MAX_ATTEMPTS;
let hintUsed = false;
let revealedWordsFull = [];
const photoWrapperEl = document.getElementById('photo-wrapper');
const photoEl = document.getElementById('bird-photo');
const badgeEl = document.getElementById('box-badge');
const checkOverlayEl = document.getElementById('check-overlay');
const heartEls = document.querySelectorAll('#hearts .heart');
const roundCounterEl = document.getElementById('round-counter');
const timerEl = document.getElementById('session-timer');
const modeLabelEl = document.getElementById('mode-label');
const inputEl = document.getElementById('answer-input');
const feedbackEl = document.getElementById('feedback');
const hintDisplayEl = document.getElementById('hint-display');
const submitBtn = document.getElementById('submit-btn');
const skipBtn = document.getElementById('skip-btn');
const hintBtn = document.getElementById('hint-btn');
const abandonBtn = document.getElementById('abandon-btn');
const quizControlsEl = document.getElementById('quiz-controls');
const wikiPanelEl = document.getElementById('wiki-panel');
const wikiExtractEl = document.getElementById('wiki-extract');
const wikiLinkEl = document.getElementById('wiki-link');

wikiLinkEl.addEventListener('click', (e) => e.stopPropagation());

if (selectedLot) {
  const lot = LOTS.find((l) => l.id === selectedLot);
  if (lot) modeLabelEl.textContent = `photo → nom · ${lot.name}`;
}

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

function dismissWikiPanel() {
  document.removeEventListener('keydown', dismissWikiPanel);
  wikiPanelEl.removeEventListener('click', dismissWikiPanel);
  wikiPanelEl.style.display = 'none';
  quizControlsEl.style.display = '';
  nextRound();
}

function showWikiPanel(bird) {
  quizControlsEl.style.display = 'none';
  wikiPanelEl.style.display = 'block';
  wikiExtractEl.textContent = 'Chargement…';
  wikiLinkEl.href = bird.wiki;

  const title = bird.wiki.split('/wiki/')[1];
  fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
    .then((res) => (res.ok ? res.json() : Promise.reject()))
    .then((data) => {
      wikiExtractEl.textContent = data.extract || 'Pas de résumé disponible pour cet oiseau.';
    })
    .catch(() => {
      wikiExtractEl.textContent = 'Impossible de charger le résumé pour le moment.';
    });

  document.addEventListener('keydown', dismissWikiPanel);
  wikiPanelEl.addEventListener('click', dismissWikiPanel);
}

function nextRound() {
  if (sessionEnded) return;
  if (roundsPlayed >= SESSION_LENGTH) {
    showSessionEnd(false);
    return;
  }
  currentBird = pickNextBird(currentBird ? currentBird.id : null);
  attemptsLeft = MAX_ATTEMPTS;
  hintUsed = false;
  revealedWordsFull = currentBird.name.split(' ').map(() => false);
  const box = getBirdState(currentBird.id).box;
  const photoPool = box >= 5 ? currentBird.images : [currentBird.images[0]];
  photoEl.src = photoPool[Math.floor(Math.random() * photoPool.length)];
  badgeEl.style.background = BOX_COLORS[box];
  resetHearts();
  checkOverlayEl.classList.remove('show');
  hintDisplayEl.textContent = '';
  hintBtn.disabled = false;
  roundCounterEl.textContent = `${roundsPlayed + 1}/${SESSION_LENGTH}`;
  inputEl.value = '';
  feedbackEl.textContent = '';
  inputEl.focus();
}

function revealAndAdvance(isSkip) {
  const bird = currentBird;
  const state = getBirdState(bird.id);
  state.box = 1;
  saveProgress(GAME_KEY, progress);
  roundResults.push({ name: bird.name, wiki: bird.wiki, heartsLost: MAX_ATTEMPTS, correct: false });
  roundsPlayed++;
  const phrase = pickRandom(isSkip ? SKIP_PHRASES : LOSS_PHRASES);
  feedbackEl.textContent = `${phrase} "${bird.name}".`;
  photoWrapperEl.classList.add('flash-wrong');
  setTimeout(() => {
    photoWrapperEl.classList.remove('flash-wrong');
    showWikiPanel(bird);
  }, 600);
}

function showSessionEnd(abandoned) {
  sessionEnded = true;
  clearInterval(timerInterval);
  document.getElementById('quiz').style.display = 'none';
  const endEl = document.getElementById('session-end');
  endEl.style.display = 'block';
  endEl.classList.add('session-end-visible');

  const durationMs = Date.now() - sessionStartTime;
  let recapExtra = '';
  if (!abandoned) {
    sessionStats.count += 1;
    sessionStats.totalXp += sessionXp;
    sessionStats.totalDurationMs += durationMs;
    if (sessionCorrectTotal > sessionStats.bestScore) {
      sessionStats.bestScore = sessionCorrectTotal;
    }
    saveProgress(SESSION_STATS_KEY, sessionStats);
  } else {
    recapExtra = '<p class="abandoned-note">Session abandonnée — non comptabilisée dans tes moyennes.</p>';
  }

  const thisDurationSec = Math.round(durationMs / 1000);
  const avgDurationSec = sessionStats.count > 0 ? Math.round((sessionStats.totalDurationMs / sessionStats.count) / 1000) : 0;
  const avgXp = sessionStats.count > 0 ? Math.round(sessionStats.totalXp / sessionStats.count) : 0;

  document.getElementById('session-recap').innerHTML = `
    ${recapExtra}
    <p>Score : ${sessionCorrectTotal}/${roundsPlayed} — Meilleur score (PB) : ${sessionStats.bestScore}/${SESSION_LENGTH}</p>
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
    const tier = (hintUsed && attemptNumber < 2) ? 2 : attemptNumber;
    const xpGained = [10, 7, 5][tier - 1] || 5;
    addXp(xpGained);
    recordDailyActivity();
    renderStats();

    sessionXp += xpGained;
    sessionCorrectTotal++;
    if (attemptNumber === 1 && !hintUsed) sessionCorrectFirstTry++;
    roundResults.push({ name: currentBird.name, wiki: currentBird.wiki, heartsLost: attemptNumber - 1, correct: true });
    roundsPlayed++;

    feedbackEl.textContent = `${pickRandom(CORRECT_PHRASES)} ! +${xpGained} XP`;
    checkOverlayEl.classList.add('show');
    submitBtn.disabled = true;
    skipBtn.disabled = true;
    hintBtn.disabled = true;
    setTimeout(() => { submitBtn.disabled = false; skipBtn.disabled = false; nextRound(); }, 600);
    return;
  }

  attemptsLeft--;
  checkPartialWordMatch(answer);
  const heartIndexLost = MAX_ATTEMPTS - attemptsLeft;
  loseHeart(heartIndexLost);

  if (attemptsLeft <= 0) {
    revealAndAdvance(false);
  } else {
    feedbackEl.textContent = pickRandom(WRONG_RETRY_PHRASES);
    inputEl.classList.add('shake');
    setTimeout(() => inputEl.classList.remove('shake'), 300);
  }
}

submitBtn.addEventListener('click', handleSubmit);
skipBtn.addEventListener('click', () => {
  if (!currentBird) return;
  revealAndAdvance(true);
});
hintBtn.addEventListener('click', () => {
  if (!currentBird || hintUsed) return;
  hintUsed = true;
  updateHintDisplay();
  hintBtn.disabled = true;
});
abandonBtn.addEventListener('click', () => {
  if (sessionEnded || !currentBird) return;
  if (!confirm('Abandonner cette session ? Ta progression sur les oiseaux déjà joués reste enregistrée, mais cette session ne comptera pas dans tes moyennes.')) return;
  showSessionEnd(true);
});
inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSubmit(); });
nextRound();