const hateKeywords = ['hate', 'bigot', 'racist', 'kill', 'destroy'];
const groomingKeywords = ['secret', 'trust me', 'do not tell', 'meet alone', 'groom'];
const threatKeywords = ['threat', 'harm', 'attack', 'shoot', 'stab', 'bomb'];

function scoreText(text, keywordList) {
  const lowered = text.toLowerCase();
  const matches = keywordList.filter((k) => lowered.includes(k));
  const score = Math.min(1, matches.length / Math.max(1, keywordList.length / 2));
  return { score, matches };
}

function classify(score) {
  if (score >= 0.7) return 'high';
  if (score >= 0.4) return 'medium';
  if (score >= 0.2) return 'low';
  return 'clean';
}

function analyzeText(text) {
  const hate = scoreText(text, hateKeywords);
  const grooming = scoreText(text, groomingKeywords);
  const threats = scoreText(text, threatKeywords);

  return {
    hateSpeech: { confidence: hate.score, matches: hate.matches, label: classify(hate.score) },
    grooming: { confidence: grooming.score, matches: grooming.matches, label: classify(grooming.score) },
    threats: { confidence: threats.score, matches: threats.matches, label: classify(threats.score) },
    overallRisk: classify(Math.max(hate.score, grooming.score, threats.score)),
  };
}

module.exports = { analyzeText };

