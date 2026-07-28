//Fonction de verification du texte (orthographe, maj,...) avec une tolerance
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