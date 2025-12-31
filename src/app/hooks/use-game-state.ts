'use client';

import { useState, useEffect, useCallback } from 'react';
import { problemBank, getProblem, getLevel, getBlock } from '@/app/data/problem-bank';
import type { Problem, Solution } from '@/app/lib/types';
import { useToast } from '@/hooks/use-toast';

const STRUGGLE_ATTEMPTS_THRESHOLD = 3;

interface HistoryEntry {
  problemId: string;
  correct: boolean;
  hints: number;
  attempts: number;
  stars: number;
}

interface GameState {
  currentBlockId: number;
  currentLevelId: number;
  currentProblemId: string;
  attempts: number;
  hintsUsed: number;
  history: HistoryEntry[];
}

const initialGameState: GameState = {
  currentBlockId: 1,
  currentLevelId: 1,
  currentProblemId: '1.1',
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

    if (isCorrect) {
      let stars = 0;
      if (gameState.hintsUsed === 0 && newAttempts === 1) {
        stars = 3;
      } else if (gameState.hintsUsed <= 1 && newAttempts <= 2) {
        stars = 2;
      } else {
        stars = 1;
      }

      toast({
        title: "Doğru!",
        description: `Harika! ${stars} yıldız kazandın.`,
        variant: 'default',
      });
      
      setGameState(prev => {
        const newHistory = prev.history.filter(h => h.problemId !== prev.currentProblemId);
        newHistory.push({ 
            problemId: prev.currentProblemId, 
            correct: true, 
            hints: prev.hintsUsed, 
            attempts: newAttempts,
            stars: stars,
        });
        return {
          ...prev,
          history: newHistory,
        };
      });

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
  }, [currentProblem, gameState.attempts, gameState.hintsUsed, toast]);

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

    if (currentProblemIndex < level.problems.length - 1) {
      const nextProblem = level.problems[currentProblemIndex + 1];
      setNext(gameState.currentBlockId, gameState.currentLevelId, nextProblem.id);
      return;
    }

    if (currentLevelIndex < block.levels.length - 1) {
      const nextLevel = block.levels[currentLevelIndex + 1];
      const nextProblem = nextLevel.problems[0];
      setNext(gameState.currentBlockId, nextLevel.id, nextProblem.id);
      toast({ title: "Seviye Atladın!", description: `'${nextLevel.title}' seviyesine ulaştın.` });
    } else if (block.checkpoint) {
      setNext(gameState.currentBlockId, gameState.currentLevelId, block.checkpoint.problem.id);
      toast({ title: "Checkpoint Zamanı!", description: "Şimdi öğrendiklerini gösterme zamanı." });
    } else if (currentBlockIndex < problemBank.blocks.length - 1) {
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
