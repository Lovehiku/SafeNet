// store/useAppStore.ts
import { create } from 'zustand';
import { authApi, alertsApi, scanApi, fakeProfileApi } from '../services/api';
import { AlertItem, AnalysisResult, FakeProfileMatch, User } from '../types';
import { getAuthToken, setAuthToken } from '../services/config';

type Settings = {
  groomingDetection: boolean;
  nsfwFilter: boolean;
  autoReporting: boolean;
  notifications: boolean;
};

type AppState = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  alerts: AlertItem[];
  analysis: AnalysisResult | null;
  fakeMatches: FakeProfileMatch[];
  fakeProfileResult: { risk: 'low' | 'medium' | 'high'; confidence: number; reason: string } | null;
  settings: Settings;

  // auth
  init: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;

  // alerts
  fetchAlerts: () => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;

  // scans
  runTextScan: (text: string) => Promise<void>;
  runImageScan: (file: File) => Promise<void>;
  runFakeProfileCheck: (file: File) => Promise<void>;

  // settings
  toggleSetting: (key: keyof Settings) => void;
};

const USER_KEY = 'safenet_user';

function persistUser(user: User | null) {
  if (typeof localStorage === 'undefined') return;
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  alerts: [],
  analysis: null,
  fakeMatches: [],
  fakeProfileResult: null,
  settings: {
    groomingDetection: true,
    nsfwFilter: true,
    autoReporting: false,
    notifications: true,
  },

  init: () => {
    const token = getAuthToken();
    const userStr = typeof localStorage !== 'undefined' ? localStorage.getItem(USER_KEY) : null;
    const user = userStr ? JSON.parse(userStr) : null;
    if (token) {
      setAuthToken(token);
      set({ user: user ?? null });
    } else {
      setAuthToken(null);
      set({ user: null });
    }
    set({ initialized: true });
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const user = await authApi.login(email, password);
      persistUser(user);
      set({ user });
    } finally {
      set({ loading: false });
    }
  },

  register: async (email, password) => {
    set({ loading: true });
    try {
      const user = await authApi.register(email, password);
      persistUser(user);
      set({ user });
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    setAuthToken(null);
    persistUser(null);
    set({ user: null, alerts: [], analysis: null, fakeMatches: [] });
  },

  fetchAlerts: async () => {
    set({ loading: true });
    try {
      const items = await alertsApi.list();
      set({ alerts: items });
    } finally {
      set({ loading: false });
    }
  },

  deleteAlert: async (id: string) => {
    set({ loading: true });
    try {
      await alertsApi.remove(id);
      set({ alerts: get().alerts.filter((a) => a.id !== id) });
    } finally {
      set({ loading: false });
    }
  },

  runTextScan: async (text: string) => {
    set({ loading: true });
    try {
      const res = await scanApi.textScan(text);
      set({ analysis: res });
    } finally {
      set({ loading: false });
    }
  },

  runImageScan: async (file: File) => {
    set({ loading: true });
    try {
      const res = await scanApi.imageScan(file);
      set({ analysis: res });
    } finally {
      set({ loading: false });
    }
  },

  runFakeProfileCheck: async (file: File) => {
    set({ loading: true });
    try {
      const result = await fakeProfileApi.check(file);
      set({ 
        fakeMatches: result.matches,
        fakeProfileResult: {
          risk: result.risk,
          confidence: result.confidence,
          reason: result.reason,
        },
      });
    } finally {
      set({ loading: false });
    }
  },

  toggleSetting: (key) => {
    const s = get().settings;
    set({ settings: { ...s, [key]: !s[key] } });
  },
}));



