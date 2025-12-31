'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { gameText } from '@/app/ui-text/game-text';

interface LevelSidebarProps {
  currentLevelId: number;
}

export function LevelSidebar({ currentLevelId }: LevelSidebarProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-bold p-4 border-b">{gameText.levelMap}</h2>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
            {/* 
              This is a simplified representation. In a future iteration, we could 
              visualize the entire pedagogical journey, showing completed, current, and locked levels.
              For now, we only show the current level to reinforce linear progression.
            */}
            <div className="p-3 bg-secondary rounded-lg">
                <p className="font-semibold text-secondary-foreground">
                    {gameText.currentLevel}: {currentLevelId}
                </p>
            </div>
        </div>
      </ScrollArea>
    </div>
  );
}
