'use client';
import { problemBank } from '@/app/data/problem-bank';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Lock } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface LevelSidebarProps {
  currentBlockId: number;
  currentLevelId: number;
  currentProblemId: string;
  onSelectProblem: (blockId: number, levelId: number, problemId: string) => void;
  completedProblems: string[];
}

export function LevelSidebar({
  currentBlockId,
  currentLevelId,
  currentProblemId,
  onSelectProblem,
  completedProblems,
}: LevelSidebarProps) {
  const currentBlockIndex = problemBank.blocks.findIndex(b => b.id === currentBlockId);

  return (
    <div className="h-full flex flex-col">
        <h2 className="text-lg font-bold p-4 border-b">Seviye Haritası</h2>
        <ScrollArea className="flex-1">
            <Accordion type="multiple" defaultValue={[`block-${currentBlockId}`]} className="w-full p-2">
            {problemBank.blocks.map((block, index) => {
                const isBlockUnlocked = index <= currentBlockIndex;
                return (
                <AccordionItem value={`block-${block.id}`} key={block.id} className="border-b-0 mb-2 rounded-lg bg-card overflow-hidden">
                    <AccordionTrigger className="px-4 text-base hover:no-underline">
                        <div className="flex items-center gap-2">
                            {isBlockUnlocked ? <CheckCircle className="h-5 w-5 text-primary" /> : <Lock className="h-5 w-5 text-muted-foreground" />}
                            <span className="font-semibold">{block.title}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-0">
                    {block.levels.map(level => (
                        <div key={level.id} className="flex flex-col pl-6 pr-2 py-1">
                            <h4 className="font-semibold text-sm mb-1 text-muted-foreground">{level.title}</h4>
                            <div className="flex flex-col items-start gap-1">
                                {level.problems.map(problem => (
                                    <Button
                                    key={problem.id}
                                    variant={currentProblemId === problem.id ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className="w-full justify-start h-auto py-1 px-2 text-left"
                                    onClick={() => onSelectProblem(block.id, level.id, problem.id)}
                                    disabled={!isBlockUnlocked}
                                    >
                                        {completedProblems.includes(problem.id) && <CheckCircle className="h-4 w-4 mr-2 text-primary" />}
                                        {problem.title || `Problem ${problem.id}`}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
                    {block.checkpoint && (
                        <div className="flex flex-col pl-6 pr-2 py-1 mt-2">
                             <h4 className="font-semibold text-sm mb-1 text-primary">CHECKPOINT</h4>
                             <Button
                                key={block.checkpoint.problem.id}
                                variant={currentProblemId === block.checkpoint.problem.id ? 'secondary' : 'ghost'}
                                size="sm"
                                className="w-full justify-start h-auto py-1 px-2 text-left font-bold"
                                onClick={() => onSelectProblem(block.id, block.levels[block.levels.length-1].id, block.checkpoint!.problem.id)}
                                disabled={!isBlockUnlocked}
                                >
                                {completedProblems.includes(block.checkpoint.problem.id) && <CheckCircle className="h-4 w-4 mr-2 text-primary" />}
                                {block.checkpoint.problem.title}
                            </Button>
                        </div>
                    )}
                    </AccordionContent>
                </AccordionItem>
                );
            })}
            </Accordion>
        </ScrollArea>
    </div>
  );
}
