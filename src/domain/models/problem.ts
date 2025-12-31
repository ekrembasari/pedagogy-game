
export type ProblemId = string;

export interface Equation {
  // Represents a single mathematical equation, e.g., "🍎 + 🍎 = 10"
  // The exact structure will depend on how you parse the problem-bank,
  // but it should be a pure data representation.
  raw: string;
}

export interface Problem {
  id: ProblemId;
  equations: Equation[];
  // The solution is part of the problem definition
  solution: Record<string, number>;
}

export interface SolutionAttempt {
  problemId: ProblemId;
  studentId: string;
  timestamp: number;
  submittedSolution: Record<string, number>;
  isConsistent: boolean; // Result from evaluateReasoningConsistency
}
