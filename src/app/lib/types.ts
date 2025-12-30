export type Shape = 'star' | 'circle' | 'triangle' | 'square';

export interface Equation {
  parts: Shape[];
  equals: number;
}

export interface Solution {
  [key: string]: number;
}

export interface RealLifeTransfer {
  title: string;
  examples: string[];
}

export interface Problem {
  id: string;
  title?: string;
  equations: Equation[];
  unknowns: Shape[];
  solution: Solution;
  hints: string[];
  checkpoint?: boolean;
}

export interface Level {
  id: number;
  title: string;
  focus: string;
  problemCount: number;
  avgTime: string;
  successCrit: string;
  nextLevel: string;
  mainSkill: string;
  mentalSentence: string;
  deliberateDifficulty: string;
  autoBehavior: string;
  tools: string[];
  problems: Problem[];
  readinessCheck: {
    items: string[];
    tip: string;
  };
  realLifeTransfer: RealLifeTransfer;
  instructorNote: {
    commonErrors: string[];
    intervention: string;
    guidingQuestions: string[];
    limitLine?: string;
  };
}

export interface Checkpoint {
    title: string;
    problem: Problem;
    passCondition: string;
    failCondition: string;
}

export interface Block {
  id: number;
  title: string;
  rationale: string;
  levels: Level[];
  checkpoint?: Checkpoint;
}

export interface ProblemBank {
  appName: string;
  appDescription: string;
  blocks: Block[];
}
