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
    if (!currentProblem) return false;

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
      points -= (newAttempts - 1) * 5; // Penalty for attempts
      if (gameState.hintsUsed === 0 && newAttempts === 1) {
        points += 50; // Bonus for perfect solve
      }
      newScore += Math.max(10, points); // Minimum 10 points

      toast({
        title: "Doğru!",
        description: `Harika! ${Math.max(10, points)} puan kazandın.`,
        variant: 'default',
      });
      
      setGameState(prev => ({
        ...prev,
        score: newScore,
        history: [...prev.history, { problemId: prev.currentProblemId, correct: true, hints: prev.hintsUsed, attempts: newAttempts }],
      }));

    } else {
      toast({
        title: "Tam Değil...",
        description: "Haydi tekrar deneyelim. Hesaplamalarını kontrol et.",
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
      toast({ title: "Bu problem için başka ipucu yok.", variant: "destructive" });
      return;
    }
    const newHintsUsed = gameState.hintsUsed + 1;
    setGameState(prev => ({ ...prev, hintsUsed: newHintsUsed }));
    toast({ title: `İpucu #${newHintsUsed}`, description: currentProblem.hints[gameState.hintsUsed] });
  }, [currentProblem, gameState.hintsUsed, toast]);

  const goToNextProblem = useCallback(() => {
    const block = problemBank.blocks.find(b => b.id === gameState.currentBlockId);
    if (!block) return;
  
    const level = block.levels.find(l => l.id === gameState.currentLevelId);
    if (!level) return;
  
    const isCheckpoint = block.checkpoint?.problem.id === gameState.currentProblemId;
    const currentProblemIndex = level.problems.findIndex(p => p.id === gameState.currentProblemId);
    const currentLevelIndex = block.levels.findIndex(l => l.id === gameState.currentLevelId);
    const currentBlockIndex = problemBank.blocks.findIndex(b => b.id === gameState.currentBlockId);
  
    // Function to set next state and reset attempts/hints
    const setNext = (blockId: number, levelId: number, problemId: string) => {
      setGameState(prev => ({
        ...prev,
        currentBlockId: blockId,
        currentLevelId: levelId,
        currentProblemId: problemId,
        attempts: 0,
        hintsUsed: 0
      }));
    };
  
    // CASE 1: Current problem is a CHECKPOINT
    if (isCheckpoint) {
      if (currentBlockIndex < problemBank.blocks.length - 1) {
        const nextBlock = problemBank.blocks[currentBlockIndex + 1];
        const nextLevel = nextBlock.levels[0];
        const nextProblem = nextLevel.problems[0];
        setNext(nextBlock.id, nextLevel.id, nextProblem.id);
        toast({ title: "Blok Tamamlandı!", description: `'${nextBlock.title}' bloğuna geçtin. Başarılar!` });
      } else {
        toast({ title: "Tebrikler!", description: "Tüm problemleri tamamladın!" });
      }
      return;
    }
  
    // CASE 2: There are more problems in the CURRENT LEVEL
    if (currentProblemIndex < level.problems.length - 1) {
      const nextProblem = level.problems[currentProblemIndex + 1];
      setNext(gameState.currentBlockId, gameState.currentLevelId, nextProblem.id);
      return;
    }
  
    // CASE 3: It's the last problem of the level, move to NEXT LEVEL or CHECKPOINT
    // If there is a next level in the current block
    if (currentLevelIndex < block.levels.length - 1) {
      const nextLevel = block.levels[currentLevelIndex + 1];
      const nextProblem = nextLevel.problems[0];
      setNext(gameState.currentBlockId, nextLevel.id, nextProblem.id);
      toast({ title: "Seviye Atladın!", description: `'${nextLevel.title}' seviyesine ulaştın.` });
    } 
    // If it's the last level of the block, move to the block's checkpoint
    else if (block.checkpoint) {
      setNext(gameState.currentBlockId, gameState.currentLevelId, block.checkpoint.problem.id);
      toast({ title: "Checkpoint Zamanı!", description: "Şimdi öğrendiklerini gösterme zamanı." });
    } 
    // Fallback: Should be handled by checkpoint logic, but in case there's no checkpoint.
    else if (currentBlockIndex < problemBank.blocks.length - 1) {
      const nextBlock = problemBank.blocks[currentBlockIndex + 1];
      const nextLevel = nextBlock.levels[0];
      const nextProblem = nextLevel.problems[0];
      setNext(nextBlock.id, nextLevel.id, nextProblem.id);
      toast({ title: "Blok Tamamlandı!", description: `'${nextBlock.title}' bloğuna geçtin.` });
    } else {
      toast({ title: "Tebrikler!", description: "Tüm problemleri tamamladın!" });
    }
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
