//Sauvegarde de la progression des diffénrets jeux
function loadProgress(gameKey) {
  const raw = localStorage.getItem('joapp_progress_' + gameKey);
  return raw ? JSON.parse(raw) : {};
}
function saveProgress(gameKey, progress) {
  localStorage.setItem('joapp_progress_' + gameKey, JSON.stringify(progress));
}