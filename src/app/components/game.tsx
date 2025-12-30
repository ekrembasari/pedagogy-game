'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, BarChart, Settings, LogOut } from 'lucide-react';
import { LevelSidebar } from './level-sidebar';
import { useGameState } from '../hooks/use-game-state';
import { ProblemDisplay } from './problem-display';
import { AnswerForm } from './answer-form';
import { InfoPanel } from './info-panel';
import { StruggleAnalysisModal } from './struggle-analysis-modal';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { problemBank } from '../data/problem-bank';

export default function Game() {
  const {
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
  } = useGameState();

  const isSolved = useMemo(() => 
    gameState.history.some(h => h.problemId === gameState.currentProblemId && h.correct),
    [gameState.history, gameState.currentProblemId]
  );
  
  const completedProblems = useMemo(() => 
    gameState.history.filter(h => h.correct).map(h => h.problemId),
    [gameState.history]
  );
  
  if (!isInitialized || !currentProblem) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="p-0">
          <LevelSidebar
            currentBlockId={gameState.currentBlockId}
            currentLevelId={gameState.currentLevelId}
            currentProblemId={gameState.currentProblemId}
            onSelectProblem={selectProblem}
            completedProblems={completedProblems}
          />
        </SidebarContent>
        <SidebarFooter className='border-t'>
            <Button onClick={resetProgress} variant="ghost">Progressi Sıfırla</Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold font-headline text-primary">
              {problemBank.appName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/report">
                    <BarChart />
                    <span className="sr-only">Raporlar</span>
                </Link>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings />
              <span className="sr-only">Ayarlar</span>
            </Button>
          </div>
        </header>

        <main className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <ProblemDisplay problem={currentProblem} />
            <AnswerForm problem={currentProblem} onSubmit={submitAnswer} onNextProblem={goToNextProblem} isSolved={isSolved} />
          </div>
          <div className="lg:col-span-1 lg:sticky top-20">
            <InfoPanel
              level={currentLevel}
              block={currentBlock}
              hints={currentProblem.hints}
              hintsUsed={gameState.hintsUsed}
              onGetHint={getHint}
              isCheckpoint={!!currentProblem.checkpoint}
            />
          </div>
        </main>
      </SidebarInset>
      <StruggleAnalysisModal
        open={showStruggleAnalysis}
        onOpenChange={setShowStruggleAnalysis}
        problem={currentProblem}
        attempts={gameState.attempts}
      />
    </SidebarProvider>
  );
}
