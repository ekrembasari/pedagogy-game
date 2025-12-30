'use client';

import { useState, useEffect, useCallback } from 'react';
import { problemBank, getProblem, getLevel, getBlock } from '@/app/data/problem-bank';
import type { Problem, Solution } from '@/app/lib/types';
import { useToast } from '@/hooks/use-toast';

const STRUGGLE_ATTEMPTS_THRESHOLD = 3;

interface GameState {
  currentBlockId: number;
  currentLevelId: number;
  currentProblemId: string;
  score: number;
  attempts: number;
  hintsUsed: number;
  history: { problemId: string; correct: boolean; hints: number; attempts: number }[];
}

const initialGameState: GameState = {
  currentBlockId: 1,
  currentLevelId: 1,
  currentProblemId: '1.1',
  score: 0,
  attempts: 0,
  hintsUsed: 0,
  history: [],
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  const [showStruggleAnalysis, setShowStruggleAnalysis] = useState(false);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('visuEquationGameState');
      if (savedState) {
        setGameState(JSON.parse(savedState));
      }
    } catch (error) {
      console.error("Failed to load game state from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('visuEquationGameState', JSON.stringify(gameState));
      } catch (error) {
        console.error("Failed to save game state to localStorage", error);
      }
    }
  }, [gameState, isInitialized]);

  const currentProblem = getProblem(gameState.currentBlockId, gameState.currentLevelId, gameState.currentProblemId);
  const currentLevel = getLevel(gameState.currentBlockId, gameState.currentLevelId);
  const currentBlock = getBlock(gameState.currentBlockId);

  const resetProgress = useCallback(() => {
    setGameState(initialGameState);
    toast({ title: "Progress Reset", description: "Your game has been reset to the beginning." });
  }, [toast]);
  
  const submitAnswer = useCallback((submittedSolution: Partial<Solution>) => {
    if (!currentProblem) return;

    let isCorrect = true;
    for (const key in currentProblem.solution) {
      if (Number(submittedSolution[key as keyof Solution]) !== currentProblem.solution[key as keyof Solution]) {
        isCorrect = false;
        break;
      }
    }

    const newAttempts = gameState.attempts + 1;
    let newScore = gameState.score;

    if (isCorrect) {
      // Dynamic Scoring
      let points = 100; // Base points
      points -= gameState.hintsUsed * 15; // Penalty for hints
      points -= (newAttempts -1) * 5; // Penalty for attempts
      if (gameState.hintsUsed === 0 && newAttempts === 1) {
        points += 50; // Bonus for perfect solve
      }
      newScore += Math.max(10, points); // Minimum 10 points

      toast({
        title: "Correct!",
        description: `You earned ${Math.max(10, points)} points. Well done!`,
        variant: 'default',
      });
      
      setGameState(prev => ({
        ...prev,
        score: newScore,
        history: [...prev.history, { problemId: prev.currentProblemId, correct: true, hints: prev.hintsUsed, attempts: newAttempts }],
      }));

    } else {
      toast({
        title: "Not quite...",
        description: "Let's try that again. Check your calculations.",
        variant: 'destructive',
      });
      setGameState(prev => ({ ...prev, attempts: newAttempts }));

      if (newAttempts >= STRUGGLE_ATTEMPTS_THRESHOLD) {
        setShowStruggleAnalysis(true);
      }
    }
    return isCorrect;
  }, [currentProblem, gameState.attempts, gameState.hintsUsed, gameState.score, toast]);

  const getHint = useCallback(() => {
    if (!currentProblem || gameState.hintsUsed >= currentProblem.hints.length) {
      toast({ title: "No more hints available for this problem.", variant: "destructive" });
      return;
    }
    const newHintsUsed = gameState.hintsUsed + 1;
    setGameState(prev => ({ ...prev, hintsUsed: newHintsUsed }));
    toast({ title: `Hint #${newHintsUsed}`, description: currentProblem.hints[gameState.hintsUsed] });
  }, [currentProblem, gameState.hintsUsed, toast]);

  const goToNextProblem = useCallback(() => {
    const block = problemBank.blocks.find(b => b.id === gameState.currentBlockId);
    if (!block) return;
  
    const level = block.levels.find(l => l.id === gameState.currentLevelId);
    if (!level) return;
  
    const currentProblemIndex = level.problems.findIndex(p => p.id === gameState.currentProblemId);
  
    // Move to next problem in the level
    if (currentProblemIndex !== -1 && currentProblemIndex < level.problems.length - 1) {
      const nextProblem = level.problems[currentProblemIndex + 1];
      setGameState(prev => ({
        ...prev,
        currentProblemId: nextProblem.id,
        attempts: 0,
        hintsUsed: 0
      }));
      return;
    }
  
    // Move to checkpoint if it exists and we finished the last problem of the last level in the block
    if (block.checkpoint && currentProblemIndex === level.problems.length - 1 && block.levels[block.levels.length - 1].id === level.id) {
       setGameState(prev => ({
        ...prev,
        currentProblemId: block.checkpoint!.problem.id,
        attempts: 0,
        hintsUsed: 0
      }));
      return;
    }

    // Move to next level in the block
    const currentLevelIndex = block.levels.findIndex(l => l.id === gameState.currentLevelId);
    if (currentLevelIndex < block.levels.length - 1) {
      const nextLevel = block.levels[currentLevelIndex + 1];
      const nextProblem = nextLevel.problems[0];
      setGameState(prev => ({
        ...prev,
        currentLevelId: nextLevel.id,
        currentProblemId: nextProblem.id,
        attempts: 0,
        hintsUsed: 0
      }));
      return;
    }
  
    // Move to next block
    const currentBlockIndex = problemBank.blocks.findIndex(b => b.id === gameState.currentBlockId);
    if (currentBlockIndex < problemBank.blocks.length - 1) {
      const nextBlock = problemBank.blocks[currentBlockIndex + 1];
      const nextLevel = nextBlock.levels[0];
      const nextProblem = nextLevel.problems[0];
      setGameState(prev => ({
        ...prev,
        currentBlockId: nextBlock.id,
        currentLevelId: nextLevel.id,
        currentProblemId: nextProblem.id,
        attempts: 0,
        hintsUsed: 0
      }));
      return;
    }
  
    // End of all content
    toast({ title: "Congratulations!", description: "You have completed all the problems!" });
  }, [gameState, toast]);

  const selectProblem = useCallback((blockId: number, levelId: number, problemId: string) => {
    setGameState(prev => ({
        ...prev,
        currentBlockId: blockId,
        currentLevelId: levelId,
        currentProblemId: problemId,
        attempts: 0,
        hintsUsed: 0,
    }));
  }, []);

  return {
    isInitialized,
    gameState,
    currentProblem,
    currentLevel,
    currentBlock,
    submitAnswer,
    getHint,
    goToNextProblem,
    resetProgress,
    selectProblem,
    showStruggleAnalysis,
    setShowStruggleAnalysis,
  };
}
