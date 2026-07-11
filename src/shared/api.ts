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
