
import { ProblemId, SolutionAttempt } from '@/domain/models/problem';
import { Level } from '@/domain/models/pedagogy';

/**
 * Determines the ID of the next problem based on the student's history
 * and the structure of the current level. This is a pure function that
 * contains the core progression logic.
 *
 * @param history A list of the student's previous attempts.
 * @param currentLevel The current Level object.
 * @returns The `ProblemId` of the next problem, or 'LEVEL_COMPLETE'.
 */
export function determineNextProblemId(
  history: SolutionAttempt[],
  currentLevel: Level
): ProblemId | 'LEVEL_COMPLETE' {
  // Find the last correctly solved problem in the current level
  const lastCorrectAttemptInLevel = history
    .slice()
    .reverse()
    .find(attempt => attempt.isConsistent && currentLevel.problems.includes(attempt.problemId));

  if (!lastCorrectAttemptInLevel) {
    // If no problems in this level have been solved correctly, start with the first one.
    return currentLevel.problems[0];
  }

  const lastSolvedIndex = currentLevel.problems.indexOf(lastCorrectAttemptInLevel.problemId);

  if (lastSolvedIndex === -1) {
    // Should not happen if data is consistent
    return currentLevel.problems[0];
  }

  if (lastSolvedIndex + 1 >= currentLevel.problems.length) {
    // The last solved problem was the final one in the level.
    return 'LEVEL_COMPLETE';
  } else {
    // Return the next problem in the sequence.
    return currentLevel.problems[lastSolvedIndex + 1];
  }
}
