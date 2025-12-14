import { FakeProfileMatch } from '../types';

export const fakeProfileMatches: FakeProfileMatch[] = [
  {
    id: 'FP-01',
    platform: 'Instagram',
    handle: '@safenet_clone',
    similarity: 92,
    note: 'Profile photo and bio match 2 of your public posts.',
  },
  {
    id: 'FP-02',
    platform: 'Facebook',
    handle: 'SafeNet Support',
    similarity: 78,
    note: 'Uses your display name with altered spelling.',
  },
  {
    id: 'FP-03',
    platform: 'TikTok',
    handle: '@secure-sis',
    similarity: 64,
    note: 'Reused video thumbnail detected; possible fan account.',
  },
];
