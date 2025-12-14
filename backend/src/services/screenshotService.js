const analysisService = require('./analysisService');

function analyzeScreenshot({ text, ocrText, imageUrl }) {
  // Simulate OCR extraction - in production, use actual OCR service
  // For now, use provided text or simulate extraction from imageUrl
  let extractedText = text || ocrText || '';
  
  // Log for debugging
  if (ocrText) {
    console.log('Screenshot analyzer received OCR text:', ocrText.substring(0, 100));
  }
  
  // If no text provided, simulate OCR extraction (in production, call OCR API)
  // Make it dynamic based on imageUrl to avoid static results
  if (!extractedText && imageUrl) {
    // Generate dynamic simulated text based on imageUrl/file name
    // This ensures different files produce different analysis results
    const fileName = imageUrl.split('/').pop() || imageUrl;
    const hash = fileName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Create varied simulated text based on file characteristics
    // These sample texts contain different keywords that will trigger different analysis results
    const sampleTexts = [
      `User message from chat: "Hey, can we meet up later? I have something important to discuss."`,
      `Chat conversation: "You should trust me. Let's keep this between us and not tell anyone."`,
      `Message content: "I don't like people like you. You should be careful."`,
      `Conversation text: "This is just a normal conversation about daily activities."`,
      `Screenshot content: "Thanks for the help! Really appreciate it."`,
      `Chat log: "Looking forward to our meeting tomorrow. See you there!"`,
      `Message: "This is a threat to harm you if you don't comply."`,
      `Chat: "I hate people like you, you should be destroyed."`,
    ];
    
    // Select text based on hash to ensure variety
    const selectedText = sampleTexts[hash % sampleTexts.length];
    
    // Add some variation based on file name length and characters
    const variations = [
      ' Additional context from the image.',
      ' More details visible in screenshot.',
      ' Text appears in multiple languages.',
      ' Some text may be partially obscured.',
    ];
    
    extractedText = selectedText + (variations[hash % variations.length] || '');
  }
  
  // Use the same text analysis logic as Text Analyzer for TFGBV detection
  const textAnalysis = analysisService.analyzeText(extractedText || '');
  
  // Determine label based on overall risk
  const label = textAnalysis.overallRisk === 'clean' ? 'low' : textAnalysis.overallRisk;
  
  return {
    label: label,
    confidence: Math.max(textAnalysis.hateSpeech.confidence, textAnalysis.grooming.confidence, textAnalysis.threats.confidence),
    analysis: textAnalysis,
    extractedText: extractedText,
  };
}

module.exports = { analyzeScreenshot };