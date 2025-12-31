'use client';
import { problemBank } from '@/app/data/problem-bank';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Lock, Star } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface LevelSidebarProps {
  currentBlockId: number;
  currentLevelId: number;
  currentProblemId: string;
  onSelectProblem: (blockId: number, levelId: number, problemId: string) => void;
  problemStatus: Map<string, number>;
}

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex">
        {Array.from({ length: 3 }).map((_, i) => (
            <Star key={i} className={cn("h-3 w-3", i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/50")} />
        ))}
    </div>
);

export function LevelSidebar({
  currentBlockId,
  currentLevelId,
  currentProblemId,
  onSelectProblem,
  problemStatus,
}: LevelSidebarProps) {
  const currentBlockIndex = problemBank.blocks.findIndex(b => b.id === currentBlockId);

  return (
    <div className="h-full flex flex-col">
        <h2 className="text-lg font-bold p-4 border-b">Seviye Haritası</h2>
        <ScrollArea className="flex-1">
            <Accordion type="multiple" defaultValue={[`block-${currentBlockId}`]} className="w-full p-2">
            {problemBank.blocks.map((block, blockIndex) => {
                const isBlockUnlocked = blockIndex <= currentBlockIndex;
                const isCurrentBlock = block.id === currentBlockId;
                const completedProblemsInBlock = block.levels.flatMap(l => l.problems).filter(p => problemStatus.has(p.id)).length;
                const totalProblemsInBlock = block.levels.flatMap(l => l.problems).length + (block.checkpoint ? 1 : 0);
                const isBlockCompleted = completedProblemsInBlock === totalProblemsInBlock;

                return (
                <AccordionItem value={`block-${block.id}`} key={block.id} className="border-b-0 mb-2 rounded-lg bg-card overflow-hidden data-[state=closed]:opacity-60" disabled={!isBlockUnlocked}>
                    <AccordionTrigger className="px-4 text-base hover:no-underline disabled:opacity-50" disabled={!isBlockUnlocked}>
                        <div className="flex items-center gap-2 w-full">
                            {!isBlockUnlocked ? <Lock className="h-5 w-5 text-muted-foreground" /> : isBlockCompleted ? <CheckCircle className="h-5 w-5 text-primary" /> : <div className="h-5 w-5" />}
                            <span className="font-semibold flex-1 text-left">{block.title}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-0">
                    {block.levels.map((level) => {
                        const currentLevelInBlockIndex = block.levels.findIndex(l => l.id === currentLevelId);
                        const levelIndex = block.levels.findIndex(l => l.id === level.id);
                        const isLevelUnlocked = isCurrentBlock ? levelIndex <= currentLevelInBlockIndex : blockIndex < currentBlockIndex;

                        return (
                            <div key={level.id} className={cn("flex flex-col pl-6 pr-2 py-1", !isLevelUnlocked && "opacity-50 pointer-events-none")}>
                                <h4 className="font-semibold text-sm mb-1 text-muted-foreground">{level.title}</h4>
                                <div className="flex flex-col items-start gap-1">
                                    {level.problems.map(problem => {
                                        const stars = problemStatus.get(problem.id) || 0;
                                        return (
                                            <Button
                                                key={problem.id}
                                                variant={currentProblemId === problem.id ? 'secondary' : 'ghost'}
                                                size="sm"
                                                className="w-full justify-between h-auto py-1 px-2 text-left"
                                                onClick={() => onSelectProblem(block.id, level.id, problem.id)}
                                                disabled={!isLevelUnlocked}
                                            >
                                                <span>{problem.title || `Problem ${problem.id}`}</span>
                                                {stars > 0 && <StarRating rating={stars} />}
                                            </Button>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                    {block.checkpoint && (() => {
                        const allLevelsInBlockComplete = block.levels.every(level => level.problems.every(p => problemStatus.has(p.id)));
                        const isCheckpointUnlocked = (isCurrentBlock && allLevelsInBlockComplete) || blockIndex < currentBlockIndex;
                        const stars = problemStatus.get(block.checkpoint.problem.id) || 0;
                        return (
                            <div className={cn("flex flex-col pl-6 pr-2 py-1 mt-2", !isCheckpointUnlocked && "opacity-50 pointer-events-none")}>
                                <h4 className="font-semibold text-sm mb-1 text-primary">CHECKPOINT</h4>
                                <Button
                                    key={block.checkpoint.problem.id}
                                    variant={currentProblemId === block.checkpoint.problem.id ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className="w-full justify-between h-auto py-1 px-2 text-left font-bold"
                                    onClick={() => onSelectProblem(block.id, block.levels[block.levels.length - 1].id, block.checkpoint!.problem.id)}
                                    disabled={!isCheckpointUnlocked}
                                >
                                    <span>{block.checkpoint.problem.title}</span>
                                    {stars > 0 && <StarRating rating={stars} />}
                                </Button>
                            </div>
                        )
                    })()}
                    </AccordionContent>
                </AccordionItem>
                );
            })}
            </Accordion>
        </ScrollArea>
    </div>
  );
}
