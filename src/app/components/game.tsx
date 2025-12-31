'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart, Settings, Expand } from 'lucide-react';

import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { useGameOrchestrator } from '@/application/useGameOrchestrator';
import { FirebaseRepository } from '@/infrastructure/persistence/FirebaseRepository';
import { LevelSidebar } from './level-sidebar';
import { ProblemDisplay } from './problem-display';
import { AnswerForm } from './answer-form';
import { InfoPanel } from './info-panel';
import { gameText } from '@/app/ui-text/game-text';

// In a real application, the repository would be provided via Context or another DI mechanism.
const repository = new FirebaseRepository();
const studentId = 'student-123'; // This would be derived from an authentication context.

export default function Game() {
  const { uiState, handleSubmitAttempt } = useGameOrchestrator(repository, studentId);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  if (uiState.isLoading || !uiState.currentProblem || !uiState.currentLevel) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{gameText.loading}</p>
      </div>
    );
  }

  // The new architecture simplifies many of the complex UI states.
  // Features like star display, detailed history, and arbitrary problem selection
  // are removed to enforce the pedagogical progression.

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="p-0">
          {/* Sidebar is simplified as direct navigation is no longer a primary feature */}
          <LevelSidebar
            currentLevelId={uiState.currentLevel.id}
          />
        </SidebarContent>
        <SidebarFooter className='border-t'>
           {/* Reset functionality can be added back in a more controlled way if needed */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold font-headline text-primary">
              VisuEquation
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/report">
                <BarChart />
                <span className="sr-only">{gameText.reports}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings />
              <span className="sr-only">{gameText.settings}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
              <Expand />
              <span className="sr-only">
                {isFullScreen ? gameText.exitFullScreen : gameText.enterFullScreen}
              </span>
            </Button>
          </div>
        </header>

        <main className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className='px-4 space-y-2'>
              <h2 className="text-lg font-semibold">
                {uiState.currentLevel.title}: {gameText.level} {uiState.currentLevel.id}
              </h2>
               {/* Progress is simplified; can be enhanced later based on history */}
              <Progress value={0} />
              <p className='text-sm text-muted-foreground'>{uiState.currentLevel.instructorNote.description}</p>
            </div>
            {/* Hint functionality is removed from the orchestrator for architectural purity */}
            {/* It can be added back as a separate, isolated feature if needed */}
            <ProblemDisplay problem={uiState.currentProblem} />
            
            {/* The Answer Form is now simpler */}
            <AnswerForm
              problem={uiState.currentProblem}
              onSubmit={handleSubmitAttempt}
            />
          </div>
          <div className="lg:col-span-1 lg:sticky top-20">
            {/* InfoPanel is simplified, showing only level-related info */}
            <InfoPanel level={uiState.currentLevel} />
          </div>
        </main>
      </SidebarInset>
      {/* The StruggleAnalysisModal has been removed for simplification. */}
      {/* It can be re-introduced by the AI/Analytics team later. */}
    </SidebarProvider>
  );
}
