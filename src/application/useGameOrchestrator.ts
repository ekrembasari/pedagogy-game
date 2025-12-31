'use client';

import { useState, useCallback, useEffect } from 'react';
import { IGameRepository } from '@/domain/ports/repositories';
import { SolutionAttempt, ProblemId, Problem } from '@/domain/models/problem';
import { Level } from '@/domain/models/pedagogy';
import { evaluateReasoningConsistency } from '@/domain/services/evaluation-service';
import { determineNextProblemId } from '@/domain/services/progression-service';
import { interpretProblem, getPedagogyForLevel } from '@/content/problem-bank-interpreter';
import { useToast } from '@/hooks/use-toast';

// The state managed by the orchestrator. It's focused on the UI needs.
interface GameUIState {
  currentProblem: Problem | null;
  currentLevel: Level | null;
  isLoading: boolean;
  attemptsOnCurrentProblem: number;
}

// The orchestrator requires a repository to function. This is Dependency Injection.
export function useGameOrchestrator(repository: IGameRepository, studentId: string) {
  const [uiState, setUiState] = useState<GameUIState>({
    currentProblem: null,
    currentLevel: null, // Correctly initialized
    isLoading: true,
    attemptsOnCurrentProblem: 0,
  });
  const [history, setHistory] = useState<SolutionAttempt[]>([]);
  const { toast } = useToast();

  // Initial load effect
  useEffect(() => {
    const initialProblemId: ProblemId = '1.1';
    const problem = interpretProblem(initialProblemId);
    const level = getPedagogyForLevel(1);

    if (problem && level) {
      setUiState({
        currentProblem: problem.rawProblem,
        currentLevel: level as Level,
        isLoading: false,
        attemptsOnCurrentProblem: 0,
      });
    }
  }, [studentId]);

  const goToNext = useCallback((historyForDecision: SolutionAttempt[]) => {
    if (!uiState.currentLevel) return;

    // 2. Call the DOMAIN to determine what's next, using the fresh history
    const nextProblemId = determineNextProblemId(historyForDecision, uiState.currentLevel);

    if (nextProblemId === 'LEVEL_COMPLETE') {
      toast({ title: "Level Complete!", description: "Moving to the next level." });
      // Logic for loading the next level would go here
      return;
    }

    const nextProblem = interpretProblem(nextProblemId);
    if (nextProblem) {
      setUiState(prev => ({
        ...prev,
        currentProblem: nextProblem.rawProblem,
        attemptsOnCurrentProblem: 0,
      }));
    }
  }, [uiState.currentLevel, toast]); // Dependency array is now correct

  const handleSubmitAttempt = useCallback(async (submittedSolution: Record<string, number>) => {
    if (!uiState.currentProblem || !studentId) return;

    const attempt: Omit<SolutionAttempt, 'isConsistent'> = {
      problemId: uiState.currentProblem.id,
      studentId,
      timestamp: Date.now(),
      submittedSolution,
    };

    const isConsistent = evaluateReasoningConsistency(
      uiState.currentProblem,
      { ...attempt, isConsistent: false }
    );

    const finalAttempt: SolutionAttempt = { ...attempt, isConsistent };

    // Create the new history array *before* setting state
    const newHistory = [...history, finalAttempt];

    setHistory(newHistory);
    setUiState(prev => ({ ...prev, attemptsOnCurrentProblem: prev.attemptsOnCurrentProblem + 1 }));

    try {
      await repository.saveAttempt(finalAttempt);
    } catch (error) {
      console.error(error);
      toast({ title: "Connection Error", description: "Could not save your progress.", variant: 'destructive'});
    }

    if (isConsistent) {
      toast({ title: "Reasoning is Consistent!", description: "Great! Let's move to the next one." });
      // Pass the new history directly to the function to avoid stale state
      goToNext(newHistory);
    } else {
      toast({ title: "Inconsistent Reasoning...", description: "Let's check our steps and try again.", variant: 'destructive' });
    }

  }, [uiState.currentProblem, studentId, repository, history, toast, goToNext]);

  return {
    uiState,
    handleSubmitAttempt,
  };
}
