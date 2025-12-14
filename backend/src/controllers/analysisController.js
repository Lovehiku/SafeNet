const analysisService = require('../services/analysisService');
const alertService = require('../services/alertService');

async function analyzeText(req, res, next) {
  try {
    const { text, createAlert } = req.body;
    
    // Perform analysis first - this should always work
    const results = analysisService.analyzeText(text || '');
    
    if (!results) {
      throw new Error('Analysis service returned no results');
    }

    // Try to save alert if requested, but don't fail the analysis if it fails
    if (createAlert && req.user?.id) {
      try {
        // Map 'clean' risk to 'low' severity for alerts
        const severity = results.overallRisk === 'clean' ? 'low' : results.overallRisk;
        
        await alertService.saveAlert(req.user.id, {
          type: 'text',
          title: 'Text analysis alert',
          severity: severity,
          message: `Detected ${results.overallRisk} risk content.`,
          metadata: results,
        });
      } catch (alertError) {
        // Log but don't fail the analysis - alert saving is optional
        console.error('Failed to save alert (non-fatal):', alertError.message || alertError);
      }
    }

    // Always return analysis results, even if alert saving failed
    return res.json({ success: true, data: results });
  } catch (err) {
    console.error('Error in analyzeText:', err.message || err);
    console.error('Stack:', err.stack);
    return res.status(500).json({ 
      success: false, 
      message: err.message || 'Internal server error during analysis'
    });
  }
}

module.exports = { analyzeText };

