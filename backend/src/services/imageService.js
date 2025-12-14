function flagScore(text, keywords) {
  const haystack = (text || '').toLowerCase();
  const hits = keywords.filter((k) => haystack.includes(k));
  const score = hits.length ? Math.min(1, 0.35 + hits.length * 0.2) : 0.08;
  return { score, hits };
}

function label(score) {
  if (score >= 0.75) return 'high';
  if (score >= 0.45) return 'medium';
  if (score >= 0.2) return 'low';
  return 'clean';
}

function analyzeImage({ imageUrl, notes }) {
  const source = `${imageUrl || ''} ${notes || ''}`;
  const nsfw = flagScore(source, ['nsfw', 'explicit', 'nude', 'porn']);
  const morph = flagScore(source, ['deepfake', 'morph', 'face swap', 'swap']);
  const impersonation = flagScore(source, ['impersonation', 'celebrity', 'politician', 'fake id']);

  const results = {
    nsfw: { confidence: nsfw.score, matches: nsfw.hits, label: label(nsfw.score) },
    morphing: { confidence: morph.score, matches: morph.hits, label: label(morph.score) },
    impersonation: { confidence: impersonation.score, matches: impersonation.hits, label: label(impersonation.score) },
  };
  const maxScore = Math.max(nsfw.score, morph.score, impersonation.score);
  return { ...results, overallRisk: label(maxScore) };
}

module.exports = { analyzeImage };

