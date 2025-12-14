let nanoid;

async function initNanoid() {
  const { customAlphabet } = await import('nanoid');
  nanoid = customAlphabet('1234567890abcdef', 8);
}

initNanoid();

function findSimilarFaces({ faceDescriptor, imageUrl }) {
  // Get input for analysis
  const input = faceDescriptor || imageUrl || 'unknown';
  const inputLower = input.toLowerCase();
  
  // Check for generic filenames (LOW RISK indicators)
  const genericPatterns = ['avatar', 'profile', 'user', 'img', 'photo', 'picture', 'pic'];
  const isGeneric = genericPatterns.some(pattern => inputLower.includes(pattern)) && 
                    /\.(png|jpg|jpeg|gif|webp)$/i.test(input);
  
  // Check for MEDIUM RISK keywords
  const mediumRiskKeywords = ['model', 'celebrity', 'verified', 'official'];
  const hasMediumRiskKeyword = mediumRiskKeywords.some(keyword => inputLower.includes(keyword));
  
  // Check for HIGH RISK keywords
  const highRiskKeywords = ['celebrity', 'public_figure', 'official_account', 'public_figure', 'famous', 'star'];
  const hasHighRiskKeyword = highRiskKeywords.some(keyword => inputLower.includes(keyword));
  
  // Simulate image reuse detection based on input characteristics
  // Create hash from input to simulate consistent but varied reuse patterns
  const inputHash = input.split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);
  const normalizedHash = inputHash % 1000;
  
  // Simulate reuse count based on input (suspicious patterns = more reuse)
  let simulatedReuseCount = 0;
  if (hasHighRiskKeyword) {
    simulatedReuseCount = 3 + (normalizedHash % 3); // 3-5 reuses for high risk
  } else if (hasMediumRiskKeyword) {
    simulatedReuseCount = 1 + (normalizedHash % 2); // 1-2 reuses for medium risk
  } else if (!isGeneric) {
    simulatedReuseCount = normalizedHash % 2; // 0-1 reuses for others
  }
  
  // Determine risk level based on criteria
  let risk;
  let confidence;
  let reason;
  let matches = [];
  
  if (hasHighRiskKeyword || simulatedReuseCount >= 3) {
    // HIGH RISK: Strong impersonation indicators
    risk = 'high';
    // Confidence: 75-95% (dynamic based on input)
    const confidencePercent = 75 + (normalizedHash % 21); // 75-95%
    reason = 'Strong impersonation indicators detected. High likelihood of fake profile.';
    
    // Generate matches for high risk
    const matchCount = 2 + (normalizedHash % 3); // 2-4 matches
    for (let i = 0; i < matchCount; i++) {
      const matchHash = (normalizedHash + i * 137) % 1000;
      matches.push({
        id: nanoid(),
        similarity: 75 + (matchHash % 21), // 75-95% similarity
        source: ['public-web', 'known-scam-dataset', 'social-platform'][matchHash % 3],
        note: 'Strong similarity to known impersonation account',
        handle: `impersonator_${(matchHash % 10000).toString().padStart(4, '0')}`,
      });
    }
    
    // topScore as decimal (0.75-0.95) for frontend conversion
    const topScore = confidencePercent / 100;
    return { matches, risk, topScore, reason };
    
  } else if (hasMediumRiskKeyword || simulatedReuseCount >= 1) {
    // MEDIUM RISK: Suspicious patterns
    risk = 'medium';
    // Confidence: 40-70% (dynamic based on input)
    const confidencePercent = 40 + (normalizedHash % 31); // 40-70%
    reason = 'Suspicious image usage patterns detected. Possible impersonation.';
    
    // Generate matches for medium risk
    const matchCount = 1 + (normalizedHash % 2); // 1-2 matches
    for (let i = 0; i < matchCount; i++) {
      const matchHash = (normalizedHash + i * 137) % 1000;
      matches.push({
        id: nanoid(),
        similarity: 40 + (matchHash % 31), // 40-70% similarity
        source: ['public-web', 'social-platform'][matchHash % 2],
        note: 'Partial similarity detected',
        handle: `suspicious_${(matchHash % 10000).toString().padStart(4, '0')}`,
      });
    }
    
    // topScore as decimal (0.40-0.70) for frontend conversion
    const topScore = confidencePercent / 100;
    return { matches, risk, topScore, reason };
    
  } else {
    // LOW RISK: Generic or no suspicious indicators
    risk = 'low';
    // Confidence: 10-30% (dynamic based on input)
    const confidencePercent = 10 + (normalizedHash % 21); // 10-30%
    reason = 'No strong impersonation or reuse indicators detected.';
    
    // Generate minimal or no matches for low risk
    if (normalizedHash % 3 === 0) { // 33% chance of a match
      matches.push({
        id: nanoid(),
        similarity: 10 + (normalizedHash % 21), // 10-30% similarity
        source: 'public-web',
        note: 'Low-confidence match',
        handle: `user_${(normalizedHash % 10000).toString().padStart(4, '0')}`,
      });
    }
    
    // topScore as decimal (0.10-0.30) for frontend conversion
    const topScore = confidencePercent / 100;
    return { matches, risk, topScore, reason };
  }
}

module.exports = { findSimilarFaces };
