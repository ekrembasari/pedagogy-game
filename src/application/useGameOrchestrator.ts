
'use client';

import { useState, useCallback, useEffect } from 'react';
import { IGameRepository } from '@/domain/ports/repositories';
import { SolutionAttempt, ProblemId, Problem } from '@/domain/models/problem';
import { Level } from '@/domain/models/pedagogy';
import { evaluateReasoningConsistency } from '@/domain/services/evaluation-service';
import { determineNextProblemId } from '@/domain/services/progression-service';
import { interpretProblem, getPedagogyForLevel } from '@/content/problem-bank-interpreter';
import { useToast } from '@/hooks/use-toast'; // Kept for UI feedback

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
    currentLevel: null,
    isLoading: true,
    attemptsOnCurrentProblem: 0,
  });
  const [history, setHistory] = useState<SolutionAttempt[]>([]); // A more robust solution might use a state management library
  const { toast } = useToast();

  // Initial load effect (simplified)
  useEffect(() => {
    // In a real app, you would fetch the student's last known level/problem from the repository.
    const initialProblemId: ProblemId = '1.1'; // Default starting problem
    const problem = interpretProblem(initialProblemId);
    const level = getPedagogyForLevel(1); // Default starting level
    
    if (problem && level) {
      setUiState({
        currentProblem: problem.rawProblem,
        currentLevel: level as Level, // You would need a proper way to cast/load a full level
        isLoading: false,
        attemptsOnCurrentProblem: 0,
      });
    }
  }, [studentId]);

  const handleSubmitAttempt = useCallback(async (submittedSolution: Record<string, number>) => {
    if (!uiState.currentProblem || !studentId) return;

    // 1. Create a stateless domain object for the attempt
    const attempt: Omit<SolutionAttempt, 'isConsistent'> = {
      problemId: uiState.currentProblem.id,
      studentId,
      timestamp: Date.now(),
      submittedSolution,
    };

    // 2. Call the DOMAIN for pure logic evaluation
    const isConsistent = evaluateReasoningConsistency(
      uiState.currentProblem,
      { ...attempt, isConsistent: false } // Pass a temporary object
    );

    const finalAttempt: SolutionAttempt = { ...attempt, isConsistent };

    // 3. Update local history and UI state
    setHistory(prev => [...prev, finalAttempt]);
    setUiState(prev => ({ ...prev, attemptsOnCurrentProblem: prev.attemptsOnCurrentProblem + 1 }));

    // 4. Call the INFRASTRUCTURE to persist the attempt
    try {
      await repository.saveAttempt(finalAttempt);
    } catch (error) {
      console.error(error);
      toast({ title: "Connection Error", description: "Could not save your progress.", variant: 'destructive'});
    }

    // 5. Provide UI feedback
    if (isConsistent) {
      toast({ title: "Reasoning is Consistent!", description: "Great! Let's move to the next one." });
      // In a real app, you might have a delay or a "continue" button click
      // before calling goToNext, but this is a simplified flow.
      goToNext();
    } else {
      toast({ title: "Inconsistent Reasoning...", description: "Let's check our steps and try again.", variant: 'destructive' });
    }

  }, [uiState.currentProblem, studentId, repository, history, toast]);

  const goToNext = useCallback(() => {
    if (!uiState.currentLevel) return;

    // 2. Call the DOMAIN to determine what's next
    const nextProblemId = determineNextProblemId(history, uiState.currentLevel);

    if (nextProblemId === 'LEVEL_COMPLETE') {
      toast({ title: "Level Complete!", description: "Moving to the next level." });
      // Here you would implement logic to load the next level, potentially
      // calling repository.updateLevelState(studentId, uiState.currentLevel.id + 1)
      // and then loading the new level's data.
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

  }, [history, uiState.currentLevel, toast, repository, studentId]);

  return {
    uiState,
    handleSubmitAttempt,
    // The UI should not be able to arbitrarily jump to the next problem.
    // It happens automatically on success.
  };
}
