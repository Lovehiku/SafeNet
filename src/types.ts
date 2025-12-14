export type Severity = 'low' | 'medium' | 'high';
export type RiskLevel = 'safe' | 'caution' | 'danger';

export type AlertCategory =
  | 'harassment'
  | 'impersonation'
  | 'doxxing'
  | 'nsfw'
  | 'hate'
  | 'scam';

export interface AlertItem {
  id: string;
  title: string;
  summary: string;
  severity: Severity;
  category: AlertCategory;
  date: string;
  status: 'open' | 'investigating' | 'resolved';
  source: string;
  recommendedAction: string;
  evidence?: string[];
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  categories: AlertCategory[];
  confidence: number;
  summary: string;
  suggestions: string[];
  categoryConfidence?: CategoryConfidence[];
}


export interface FakeProfileMatch {
  id: string;
  platform: string;
  handle: string;
  similarity: number;
  note: string;
}

export interface User {
  email: string;
  name: string;
}

export interface QuickScan {
  label: string;
  value: string;
  delta?: string;
  risk: RiskLevel;
}

export interface CategoryConfidence {
  category:'hate speech' | 'grooming' | 'threats' | 'harassment' | 'impersonation' | 'nsfw' | 'scam' | 'other';
  confidence: number;
}
