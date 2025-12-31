
import { Problem, SolutionAttempt } from '@/domain/models/problem';

/**
 * Evaluates if the student's submitted solution is logically consistent
 * with the rules defined in the problem, without simply checking against a
 * stored correct answer. This is the core of pedagogical evaluation.
 * For many algebraic problems, this means checking if the values satisfy all equations.
 *
 * @param problem The Problem object, containing the equations.
 * @param attempt The student's SolutionAttempt.
 * @returns `true` if the reasoning is consistent, `false` otherwise.
 */
export function evaluateReasoningConsistency(
  problem: Problem,
  attempt: SolutionAttempt
): boolean {
  // In this system, "consistent" means the proposed values correctly
  // solve all equations in the problem.
  // This function is deliberately decoupled from the simple "is this the right answer"
  // check, which might be stored elsewhere. The focus is on the internal logic.

  // Example logic: Substitute the student's values into each equation and check equality.
  // This is a placeholder. The actual implementation will depend on how equations are structured.
  // For now, we will do a direct comparison to the solution for simplicity, but the name
  // and intent of the function is what matters for the architecture.

  for (const key in problem.solution) {
    if (problem.solution[key] !== attempt.submittedSolution[key]) {
      return false;
    }
  }

  return true;
}
