
export type CognitiveSkill = string; // e.g., "Single Variable Isolation", "Cross-Equation Reasoning"
export type MentalSentence = string; // e.g., "If two shapes are the same, they must have the same value."

export interface CommonError {
  description: string;
  // Example: 'Student assumes the first symbol is always 1.'
}

export interface InstructorGuidance {
  commonErrors: CommonError[];
  guidingQuestions: string[];
}

export interface Level {
  id: number;
  title: string;
  problems: ProblemId[];
  mainSkill: CognitiveSkill;
  mentalSentence: MentalSentence;
  instructorNote: InstructorGuidance;
}
