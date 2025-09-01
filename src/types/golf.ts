// Golf Tournament Management Types
export interface CourseHole {
  number: number;
  par: number;
  handicapIndex: number;
  yardage?: {
    red?: number;
    white?: number;
    blue?: number;
    yellow?: number;
    green?: number;
  };
}

export interface Course {
  id: string;
  name: string;
  holes: CourseHole[];
  tees: {
    red: { slope: number; rating: number };
    white: { slope: number; rating: number };
    blue: { slope: number; rating: number };
    yellow?: { slope: number; rating: number };
    green?: { slope: number; rating: number };
  };
}

export interface Player {
  id: string;
  name: string;
  handicapIndex: number;
  courseHandicap: number;
  class: 'A' | 'B' | 'C' | 'Senior';
  teeColor: 'red' | 'white' | 'blue' | 'yellow' | 'green';
  isMember: boolean;
  isPlayingSkins: boolean;
  isPlayingCorners: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  courseId: string;
  players: Player[];
  hasSkinsCompetition: boolean;
  hasCornersCompetition: boolean;
  isStablefordScoring: boolean;
  status: 'setup' | 'in_progress' | 'completed';
}

export interface HoleScore {
  holeNumber: number;
  par: number;
  handicapIndex: number;
  grossScore: number | null;
  netScore: number | null;
  playerGetsStroke: boolean;
  stablefordPoints?: number;
}

export interface PlayerScores {
  playerId: string;
  tournamentId: string;
  scores: HoleScore[];
  totalGross: number;
  totalNet: number;
  totalToPar: number;
  stablefordTotal?: number;
  frontNine: { gross: number; net: number; toPar: number };
  backNine: { gross: number; net: number; toPar: number };
}

export interface SkinResult {
  hole: number;
  winners: Array<{
    playerId: string;
    playerName: string;
    score: number;
    skinPoints: number; // 1.0 for sole winner, 0.5 for two-way tie, etc.
  }>;
  pushes?: number; // Skins that carry over to next hole
}

export interface CornerResult {
  cornerNumber: number;
  holes: number[];
  winners: Array<{
    playerId: string;
    playerName: string;
    totalScore: number;
    points: number;
  }>;
}

export interface ClassResults {
  class: 'A' | 'B' | 'C' | 'Senior';
  players: Array<{
    playerId: string;
    playerName: string;
    isMember: boolean;
    grossScore: number;
    netScore: number;
    toPar: number;
    position: number;
  }>;
}

export interface TournamentResults {
  tournamentId: string;
  classResults: ClassResults[];
  skinResults: SkinResult[];
  cornerResults?: CornerResult[];
  lastUpdated: Date;
}