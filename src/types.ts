export interface GameState {
  money: number;
  debt: number;
  crop: number;
  cropHealth: number;
  score: number;
  month: number;
  wiseDecisions: number;
  insured: boolean;
  enam: boolean;
  kcc: boolean;
  stored: number;
  fpo: boolean;
  savings: number;
}

export interface Choice {
  text: string;
  effect: Partial<GameState>;
  consequence: string;
  isWise: boolean;
  isUPI?: boolean;
}

export interface MonthData {
  name: string;
  season: string;
  description: string;
  tip: string;
  choices: Choice[];
}

export interface LeaderboardEntry {
  id?: string;
  userId: string;
  displayName: string;
  score: number;
  money: number;
  wiseDecisions: number;
  timestamp: any;
}
