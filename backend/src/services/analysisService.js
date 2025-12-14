// Comprehensive keyword lists for TFGBV detection
const hateKeywords = [
  'hate', 'bigot', 'racist', 'kill', 'destroy', 'die', 'worthless', 'trash',
  'disgusting', 'pathetic', 'ugly', 'stupid', 'idiot', 'moron', 'slut', 'whore',
  'bitch', 'cunt', 'faggot', 'retard', 'nazi', 'kys', 'kill yourself'
];

const groomingKeywords = [
  'secret', 'trust me', 'do not tell', 'meet alone', 'groom', 'our little secret',
  'dont tell anyone', "don't tell", 'just between us', 'meet me', 'come over',
  'send me', 'show me', 'private', 'special', 'age is just a number', 'mature for your age',
  'no one will know', 'keep this between us', 'youre so mature', 'youre special'
];

const threatKeywords = [
  'threat', 'harm', 'attack', 'shoot', 'stab', 'bomb', 'hurt', 'kill', 'die',
  'beat', 'punch', 'hit', 'rape', 'assault', 'violence', 'revenge', 'payback',
  'youll regret', "you'll regret", 'watch your back', 'coming for you', 'find you',
  'expose you', 'ruin you', 'destroy you', 'end you'
];

function scoreText(text, keywordList) {
  const lowered = text.toLowerCase();
  // Find all matching keywords
  const matches = keywordList.filter((k) => lowered.includes(k));
  
  // Calculate score based on:
  // 1. Number of matches (more matches = higher score)
  // 2. Text length (shorter texts with matches are more concerning)
  // 3. Match density (matches per word)
  const wordCount = lowered.split(/\s+/).filter(w => w.length > 0).length;
  const matchCount = matches.length;
  const matchDensity = wordCount > 0 ? matchCount / wordCount : matchCount;
  
  // Base score from match count (normalized by keyword list size)
  const baseScore = Math.min(1, matchCount / Math.max(1, keywordList.length / 3));
  
  // Boost score if match density is high (many matches in short text)
  const densityBoost = Math.min(0.3, matchDensity * 0.5);
  
  // Final score combines base and density
  const finalScore = Math.min(1, baseScore + densityBoost);
  
  return { score: finalScore, matches };
}

function classify(score) {
  if (score >= 0.7) return 'high';
  if (score >= 0.4) return 'medium';
  if (score >= 0.2) return 'low';
  return 'clean';
}

function analyzeText(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return {
      hateSpeech: { confidence: 0, matches: [], label: 'clean' },
      grooming: { confidence: 0, matches: [], label: 'clean' },
      threats: { confidence: 0, matches: [], label: 'clean' },
      overallRisk: 'clean',
    };
  }

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

