
import { SolutionAttempt } from '@/domain/models/problem';
import { CognitiveStrugglePattern } from '@/domain/models/analysis';

/**
 * Infers a student's cognitive struggle pattern based on a series of attempts.
 * This is a read-only, pure function with no side effects. Its purpose is to
 * provide insights for the AI/reporting layer.
 *
 * @param attempts A series of SolutionAttempt objects for a specific problem.
 * @returns The inferred `CognitiveStrugglePattern`.
 */
export function inferCognitiveStruggle(
  attempts: SolutionAttempt[]
): CognitiveStrugglePattern {
  if (attempts.length < 3) {
    // Not enough data to infer a pattern.
    return 'None';
  }

  const incorrectAttempts = attempts.filter(a => !a.isConsistent);
  if (incorrectAttempts.length < 3) {
    return 'None';
  }

  // Heuristic for RandomGuessing: High variance in answers
  const uniqueAnswers = new Set(incorrectAttempts.map(a => JSON.stringify(a.submittedSolution)));
  if (uniqueAnswers.size / incorrectAttempts.length > 0.8) {
    return 'RandomGuessing';
  }

  // Heuristic for SingleVariableFixation: One value changes, others are static
  const firstAttemptValues = Object.values(incorrectAttempts[0].submittedSolution);
  const isFixated = incorrectAttempts.every(a => {
    const currentValues = Object.values(a.submittedSolution);
    const changedValues = firstAttemptValues.filter((v, i) => v !== currentValues[i]);
    return changedValues.length <= 1;
  });
  if (isFixated) {
    return 'SingleVariableFixation';
  }

  // This is a simplified placeholder. A real implementation would be far more
  // sophisticated, involving deeper analysis of the problem structure and the
  // nature of the errors.

  return 'InconsistentReasoning'; // Default fallback struggle
}
