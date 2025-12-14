const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('1234567890abcdef', 8);

function findSimilarFaces({ faceDescriptor, imageUrl }) {
  // Stubbed external call; in production call face-recognition API (AWS Rekognition, Azure Face, etc.)
  const seed = (faceDescriptor || imageUrl || 'unknown').length;
  const baseScore = Math.min(0.95, 0.35 + (seed % 5) * 0.12);

  const matches = [
    {
      id: nanoid(),
      similarity: baseScore,
      source: 'public-web',
      note: 'Possible reused avatar',
    },
    {
      id: nanoid(),
      similarity: Math.max(0.18, baseScore - 0.25),
      source: 'known-scam-dataset',
      note: 'Low-confidence historical match',
    },
  ];

  const risk = baseScore >= 0.75 ? 'high' : baseScore >= 0.5 ? 'medium' : 'low';

  return { matches, risk, topScore: baseScore };
}

module.exports = { findSimilarFaces };

