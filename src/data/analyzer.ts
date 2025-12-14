import { AnalysisResult } from '../types';

export const sampleAnalysis: AnalysisResult = {
  riskLevel: 'caution',
  categories: ['harassment', 'nsfw'],
  confidence: 82,
  summary:
    'Detected targeted insults and blurred explicit imagery. Recommended to document and avoid responding directly.',
  suggestions: [
    'Save a PDF of the conversation thread as evidence.',
    'Enable comment filters and restrict DMs for 24 hours.',
    'Share a quick wellbeing check with a trusted contact.',
  ],
};
