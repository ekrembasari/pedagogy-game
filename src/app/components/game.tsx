'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { BarChart, Settings, Expand } from 'lucide-react';
import { LevelSidebar } from './level-sidebar';
import { useGameState } from '../hooks/use-game-state';
import { ProblemDisplay } from './problem-display';
import { AnswerForm } from './answer-form';
import { InfoPanel } from './info-panel';
import { StruggleAnalysisModal } from './struggle-analysis-modal';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { problemBank } from '../data/problem-bank';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';

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

  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const { isSolved, stars } = useMemo(() => {
    const historyEntry = gameState.history.find(h => h.problemId === gameState.currentProblemId && h.correct);
    return {
      isSolved: !!historyEntry,
      stars: historyEntry?.stars || 0
    };
  }, [gameState.history, gameState.currentProblemId]);
  
  const problemStatus = useMemo(() => {
    const statusMap = new Map<string, number>();
    gameState.history.forEach(h => {
        if(h.correct) {
            statusMap.set(h.problemId, h.stars);
        }
    });
    return statusMap;
  }, [gameState.history]);

  const levelProgress = useMemo(() => {
    if (!currentLevel) return 0;
    const completedInLevel = currentLevel.problems.filter(p => problemStatus.has(p.id));
    return (completedInLevel.length / currentLevel.problems.length) * 100;
  }, [currentLevel, problemStatus]);
  
  if (!isInitialized || !currentProblem || !currentLevel) {
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
            problemStatus={problemStatus}
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
             <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
              <Expand />
              <span className="sr-only">{isFullScreen ? 'Tam Ekrandan Çık' : 'Tam Ekrana Geç'}</span>
            </Button>
          </div>
        </header>

        <main className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className='px-4 space-y-2'>
                <h2 className="text-lg font-semibold">{currentLevel.title}: Seviye {currentLevel.id}</h2>
                <Progress value={levelProgress} />
                <p className='text-sm text-muted-foreground'>{currentLevel.focus}</p>
            </div>
            <ProblemDisplay 
              problem={currentProblem}
              onGetHint={getHint}
              hintsUsedCount={gameState.hintsUsed}
            />
            <AnswerForm problem={currentProblem} onSubmit={submitAnswer} onNextProblem={goToNextProblem} isSolved={isSolved} stars={stars} />
          </div>
          <div className="lg:col-span-1 lg:sticky top-20">
            <InfoPanel
              level={currentLevel}
              block={currentBlock}
              hints={currentProblem.hints}
              hintsUsed={gameState.hintsUsed}
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
