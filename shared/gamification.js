const STATS_KEY = 'joapp_stats';

function loadStats() {
  const raw = localStorage.getItem(STATS_KEY);
  return raw ? JSON.parse(raw) : { xp: 0, streak: 0, lastPlayedDate: null };
}
function saveStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}
function todayStr() {
  return new Date().toISOString().slice(0, 10); // format "AAAA-MM-JJ"
}

function addXp(amount) {
  const stats = loadStats();
  stats.xp += amount;
  saveStats(stats);
  return stats;
}

// À appeler dès qu'un vrai progrès est fait dans la session (une bonne réponse)
function recordDailyActivity() {
  const stats = loadStats();
  const today = todayStr();
  if (stats.lastPlayedDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    stats.streak = (stats.lastPlayedDate === yesterday) ? stats.streak + 1 : 1;
    stats.lastPlayedDate = today;
    saveStats(stats);
  }
  return stats;
}