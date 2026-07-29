function renderStats() {
  const el = document.getElementById('stats-bar');
  if (!el) return;
  const stats = loadStats();
  el.textContent = `⭐ ${stats.xp} XP · 🔥 ${stats.streak} j`;
}
document.addEventListener('DOMContentLoaded', renderStats);