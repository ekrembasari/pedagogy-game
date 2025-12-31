
import { ProblemId, Problem } from '@/domain/models/problem';
import { CognitiveSkill, MentalSentence, CommonError, Level } from '@/domain/models/pedagogy';
import { problemBank } from '@/app/data/problem-bank'; // Assuming this is the raw data source

// This is a placeholder type. You would flesh this out based on your actual data structure.
// It enriches the raw problem with pedagogical context.
export interface InterpretedProblem {
  id: ProblemId;
  rawProblem: Problem;
  associatedSkill: CognitiveSkill;
  intendedMentalSentence: MentalSentence;
  potentialPitfalls: CommonError[];
}

// This function would look up the level associated with a problem
function findLevelForProblem(problemId: ProblemId): Level | undefined {
    for (const block of problemBank.blocks) {
        for (const level of block.levels) {
            if (level.problems.some(p => p.id === problemId)) {
                // This is a simplified lookup. You'd need to adapt this to your actual data structure.
                // It's also inefficient and should be memoized or pre-calculated in a real app.
                return {
                    id: level.id,
                    title: level.title,
                    problems: level.problems.map(p => p.id),
                    mainSkill: level.mainSkill,
                    mentalSentence: level.mentalSentence,
                    instructorNote: level.instructorNote,
                };
            }
        }
    }
    return undefined;
}

export function interpretProblem(id: ProblemId): InterpretedProblem | undefined {
  // This is a simplified implementation. A real implementation would need a more robust
  // way to find a problem by its ID across all blocks and levels.
  let rawProblem: Problem | undefined;
  for (const block of problemBank.blocks) {
    for (const level of block.levels) {
      const foundProblem = level.problems.find(p => p.id === id);
      if (foundProblem) {
        rawProblem = foundProblem as Problem;
        break;
      }
    }
    if (rawProblem) break;
  }

  if (!rawProblem) {
    return undefined;
  }

  const level = findLevelForProblem(id);

  if (!level) {
    // Or handle this error more gracefully
    throw new Error(`Pedagogical context not found for problem ${id}`);
  }

  return {
    id,
    rawProblem,
    associatedSkill: level.mainSkill,
    intendedMentalSentence: level.mentalSentence,
    potentialPitfalls: level.instructorNote.commonErrors,
  };
}

export function getPedagogyForLevel(levelId: number): { skill: CognitiveSkill; mentalSentence: MentalSentence; commonErrors: CommonError[]; } | undefined {
    for (const block of problemBank.blocks) {
        const level = block.levels.find(l => l.id === levelId);
        if (level) {
            return {
                skill: level.mainSkill,
                mentalSentence: level.mentalSentence,
                commonErrors: level.instructorNote.commonErrors,
            };
        }
    }
    return undefined;
}

export function getExpectedReasoningPath(problemId: ProblemId): CognitiveSkill[] {
  // This is a placeholder for a powerful future feature.
  // A real implementation would involve a more sophisticated mapping
  // from a problem to the sequence of cognitive skills required to solve it.
  // For now, it might return the primary skill associated with the level.
  const level = findLevelForProblem(problemId);
  return level ? [level.mainSkill] : [];
}
