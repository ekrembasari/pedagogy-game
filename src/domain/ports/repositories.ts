
import { SolutionAttempt, ProblemId } from '@/domain/models/problem';

/**
 * The port for the game application loop, responsible for writing state.
 */
export interface IGameRepository {
  saveAttempt(attempt: SolutionAttempt): Promise<void>;
  updateLevelState(studentId: string, newLevel: number): Promise<void>;
}

/**
 * The port for the AI and analysis layer, responsible for read-only operations.
 * This interface ensures the analysis layer CANNOT mutate game state.
 */
export interface IAnalyticsRepository {
  getAttemptsForAnalysis(
    studentId: string,
    level: number
  ): Promise<SolutionAttempt[]>;
}
