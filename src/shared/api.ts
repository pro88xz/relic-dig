export type Rarity = 'junk' | 'common' | 'rare' | 'legendary';

export type RelicDef = {
  id: string;
  name: string;
  rarity: Rarity;
  plaque: string;
  glyph: string;
  pieces: number;
};

export type TileContent =
  | { kind: 'empty' }
  | { kind: 'relic'; relicId: string; piece: number };

export type Tile = {
  index: number;
  dug: boolean;
  content: TileContent | null;
};

export type MuseumEntry = {
  relicId: string;
  piecesHeld: number[];
  complete: boolean;
};

export type InitResponse = {
  type: 'init';
  postId: string;
  username: string;
  siteId: string;
  gridSize: number;
  digsTotal: number;
  digsUsed: number;
  tiles: Tile[];
  catalog: RelicDef[];
  heat: number[];
  streak: number;
  bonusDigs: number;
};

export type DigResponse = {
  type: 'dig';
  index: number;
  content: TileContent;
  revealed: RelicDef | null;
  digsUsed: number;
  digsTotal: number;
  completedRelic: boolean;
  heat: number[];
  streak: number;
};

export type MuseumResponse = {
  type: 'museum';
  username: string;
  entries: MuseumEntry[];
  catalog: RelicDef[];
};

export type ErrorResponse = {
  status: 'error';
  message: string;
};

export type Submission = {
  id: string;
  author: string;
  name: string;
  plaque: string;
  rarity: Rarity;
  icon: string;
  votes: number;
  createdAt: number;
};

export type SubmissionWithVote = Submission & { youVoted: boolean };

export type ListSubmissionsResponse = {
  type: 'submissions';
  items: SubmissionWithVote[];
};

export type SubmitResponse = {
  type: 'submitted';
  submission: Submission;
};

export type VoteResponse = {
  type: 'voted';
  submission: Submission;
  youVoted: boolean;
};

export type ThemeInfo = {
  id: string;
  name: string;
  kicker: string;
  blurb: string;
  accent: string;
  bgTop: string;
  bgBottom: string;
};

export type CollectionRelic = {
  id: string;
  name: string;
  rarity: string;
  owned: boolean;
};

export type CollectionInfo = {
  id: string;
  name: string;
  wing: string;
  blurb: string;
  themeHint: string;
  total: number;
  have: number;
  complete: boolean;
  relics: CollectionRelic[];
};

export type ExhibitInfo = {
  week: string;
  progress: number;
  goal: number;
  complete: boolean;
  reward: { name: string; blurb: string };
};

export type ProgressResponse = {
  type: 'progress';
  rank: string;
  completedCollections: number;
  totalCollections: number;
  collections: CollectionInfo[];
  exhibit: ExhibitInfo;
};

export type LeaderboardEntry = {
  username: string;
  score: number;
  wings: number;
  relics: number;
};

export type LeaderboardResponse = {
  type: 'leaderboard';
  top: LeaderboardEntry[];
  myRank: number | null;
  myScore: number;
};
