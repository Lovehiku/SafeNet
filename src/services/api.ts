// services/api.ts
import axios from 'axios';
import { AlertItem, AnalysisResult, FakeProfileMatch, User, CategoryConfidence } from '../types';
import { apiConfig, getAuthToken, setAuthToken } from './config';

export const api = axios.create({
  baseURL: apiConfig.baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      setAuthToken(null);
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('safenet_user');
      }
      if (typeof window !== 'undefined') {
        window.location.hash = '#/login';
      }
    }
    return Promise.reject(error);
  }
);

function mapRisk(overall?: string): AnalysisResult['riskLevel'] {
  if (overall === 'high' || overall === 'critical') return 'danger';
  if (overall === 'medium') return 'caution';
  return 'safe';
}

export const authApi = {
  async login(email: string, password: string): Promise<User> {
    const { data } = await api.post('/auth/login', { email, password });
    setAuthToken(data.token);
    const user = { email: data.user.email, name: data.user.name || data.user.email };
    if (typeof localStorage !== 'undefined') localStorage.setItem('safenet_user', JSON.stringify(user));
    return user;
  },
  async register(email: string, password: string): Promise<User> {
    const { data } = await api.post('/auth/register', { email, password, name: email.split('@')[0] });
    setAuthToken(data.token);
    const user = { email: data.user.email, name: data.user.name || data.user.email };
    if (typeof localStorage !== 'undefined') localStorage.setItem('safenet_user', JSON.stringify(user));
    return user;
  },
};

export const scanApi = {
  async textScan(text: string): Promise<AnalysisResult> {
    const { data } = await api.post('/text/analyze', { text, createAlert: true });
    const result = data.data;
    const categories: AnalysisResult['categories'] = [];
    if (result.hateSpeech.matches.length) categories.push('hate');
    if (result.grooming.matches.length || result.threats.matches.length) categories.push('harassment');
    const categoryConfidence: CategoryConfidence[] = [
      { category: 'hate speech', confidence: Math.round((result.hateSpeech.confidence || 0) * 100) },
      { category: 'grooming', confidence: Math.round((result.grooming.confidence || 0) * 100) },
      { category: 'threats', confidence: Math.round((result.threats.confidence || 0) * 100) },
      { category: 'harassment', confidence: Math.round((Math.max(result.grooming.confidence || 0, result.threats.confidence || 0)) * 100) },
    ];
    return {
      riskLevel: mapRisk(result.overallRisk),
      categories,
      confidence: Math.round(Math.max(result.hateSpeech.confidence, result.threats.confidence, result.grooming.confidence) * 100),
      summary: `Overall risk: ${result.overallRisk}. Matches: ${[...result.hateSpeech.matches, ...result.grooming.matches, ...result.threats.matches].join(', ') || 'none'}`,
      suggestions: [
        result.hateSpeech.matches.length ? 'Consider muting or filtering comments.' : 'No hate speech matches.',
        result.grooming.matches.length ? 'Document and avoid private chats.' : 'No grooming indicators.',
        result.threats.matches.length ? 'Preserve evidence and escalate if needed.' : 'No threats found.',
      ],
      categoryConfidence,
    };
  },
  async imageScan(file: File): Promise<AnalysisResult> {
  const { data } = await api.post('/screenshot/analyze', {
    imageUrl: file.name,
    notes: 'uploaded via UI',
    createAlert: true,
  });

  const result = data.data; // screenshotController returns { label, confidence }

  // Map categories based on label
  const categories: AnalysisResult['categories'] = [];
  if (result.label === 'nsfw') categories.push('nsfw');
  if (result.label === 'impersonation') categories.push('impersonation');
  if (result.analysis) {
    if (result.analysis.hateSpeech?.matches?.length) categories.push('hate');
    if ((result.analysis.grooming?.matches?.length || result.analysis.threats?.matches?.length)) categories.push('harassment');
  }

  return {
    riskLevel:
      result.label === 'critical' || result.label === 'high'
        ? 'danger'
        : result.label === 'medium'
        ? 'caution'
        : 'safe',
    categories,
    confidence: Math.round((result.confidence || 0) * 100),
    summary: `Screenshot flagged as ${result.label}`,
    suggestions: [`Detected label: ${result.label}`],
  };
}
};

export const fakeProfileApi = {
  async check(file: File): Promise<{ matches: FakeProfileMatch[]; risk: 'low' | 'medium' | 'high'; confidence: number; reason: string }> {
    const { data } = await api.post('/fake-profiles/detect', { imageUrl: file.name, createAlert: true });
    const payload = data.data || {};
    const matchesRaw = payload.matches || [];
    const matches: FakeProfileMatch[] = matchesRaw.map((m: any, idx: number) => ({
      id: m.id || `${idx}`,
      platform: m.source || 'web',
      handle: m.handle || m.note || 'unknown',
      similarity: Math.round((m.similarity || 0) * 100),
      note: m.note || 'Potential match',
    }));
    const confidence = Math.round((payload.topScore || 0) * 100);
    const reason =
      payload.risk === 'high'
        ? 'Reused image patterns and strong similarity detected.'
        : payload.risk === 'medium'
        ? 'Partial similarity with known impersonation patterns.'
        : 'Low similarity; minimal risk indicators.';
    return { matches, risk: payload.risk || 'low', confidence, reason };
  },
};

export const alertsApi = {
  async list(): Promise<AlertItem[]> {
    const { data } = await api.get('/alerts');
    const items = (data.data || []).map((a: any, idx: number) => ({
      id: a._id || a.id || `${idx}`,
      title: a.title || 'Alert',
      summary: a.message || a.metadata?.message || a.metadata?.summary || 'Alert detail',
      severity: (a.severity as AlertItem['severity']) || 'low',
      category: (() => {
        const t = (a.type || '').toLowerCase();
        if (t === 'fake-profile') return 'impersonation';
        if (t === 'image' || t === 'screenshot') {
          const lbl = a.metadata?.label || a.metadata?.overallRisk;
          if (lbl === 'nsfw') return 'nsfw';
          if (lbl === 'high' || lbl === 'medium' || lbl === 'low') {
            return (a.metadata?.hateSpeech?.matches?.length ? 'hate' : (a.metadata?.grooming?.matches?.length || a.metadata?.threats?.matches?.length) ? 'harassment' : 'harassment') as AlertItem['category'];
          }
          return 'harassment';
        }
        // text analysis alerts
        const md = a.metadata || {};
        if (md.hateSpeech?.matches?.length) return 'hate';
        if (md.grooming?.matches?.length || md.threats?.matches?.length) return 'harassment';
        // fallback to scam if message hints
        const m = (a.message || '').toLowerCase();
        if (m.includes('phish') || m.includes('scam')) return 'scam';
        return 'harassment';
      })(),
      date: a.createdAt || new Date().toISOString(),
      status: 'open',
      source: a.type || 'text',
      recommendedAction: 'Review and acknowledge',
      evidence: Array.isArray(a.metadata?.evidence) ? a.metadata.evidence : [],
    }));
    return items;
  },
  async create(payload: { title: string; severity?: string; message?: string; type?: string; metadata?: any }) {
    await api.post('/alerts', payload);
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/alerts/${id}`);
  },
};
