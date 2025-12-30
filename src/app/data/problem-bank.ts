import type { ProblemBank, Block, Level, Problem } from '@/app/lib/types';
import data from './problem-bank.json';

export const problemBank: ProblemBank = data as ProblemBank;

export function getProblem(blockId: number, levelId: number, problemId: string): Problem | undefined {
  const block = problemBank.blocks.find(b => b.id === blockId);
  if (!block) return undefined;
  
  const level = block.levels.find(l => l.id === levelId);
  if (level && level.problems) {
    const problem = level.problems.find(p => p.id === problemId);
    if (problem) return problem;
  }
  
  if (block.checkpoint && block.checkpoint.problem.id === problemId) {
    return block.checkpoint.problem;
  }
  
  return undefined;
}

export function getLevel(blockId: number, levelId: number): Level | undefined {
  const block = problemBank.blocks.find(b => b.id === blockId);
  if (!block) return undefined;
  return block.levels.find(l => l.id === levelId);
}

export function getBlock(blockId: number): Block | undefined {
    return problemBank.blocks.find(b => b.id === blockId);
}
