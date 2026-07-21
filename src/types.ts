/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PlayerStats {
  gpa: number;       // 0 to 100 (where 100 corresponds to 4.0 GPA, i.e. GPA = value / 25)
  stress: number;    // 0 to 100 (căng thẳng)
  energy: number;    // 0 to 100 (năng lượng)
  money: number;     // 0 to 100 (tiền tài, ví dụ 100 = 10 triệu đồng, 1 = 100k VNĐ)
  happiness: number; // 0 to 100 (hạnh phúc)
}

export interface OptionOutcome {
  gpa: number;
  stress: number;
  energy: number;
  money: number;
  happiness: number;
  textFeedback: string;
}

export interface ChoiceOption {
  id: string;
  text: string;
  outcome: OptionOutcome;
}

export interface GameEvent {
  id: string;
  title: string;
  category: "study" | "social" | "health" | "money" | "campus" | "exam";
  description: string;
  options: ChoiceOption[];
  triggerDay?: number; // optional, can target a specific day
}

export interface DailyActivity {
  id: string;
  name: string;
  description: string;
  icon: string;
  baseCost: {
    gpa: number;
    stress: number;
    energy: number;
    money: number;
    happiness: number;
  };
  colorClass: string;
}

export type GamePhase = "START" | "INTRO" | "GAMEPLAY" | "EVENT" | "DAILY_FEEDBACK" | "SUMMARY" | "GAMEOVER";

export interface GameHistoryEntry {
  day: number;
  activityName: string;
  eventTitle?: string;
  choiceMade?: string;
  statsImpact: Partial<PlayerStats>;
}
