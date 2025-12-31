'use client';
import React from 'react';
import type { Problem } from '@/app/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShapeIcon } from './icons';
import { Plus, Equal, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProblemDisplayProps {
  problem: Problem;
  onGetHint: () => void;
  hintsUsedCount: number;
}

export function ProblemDisplay({ problem, onGetHint, hintsUsedCount }: ProblemDisplayProps) {
  const isRelational = (eq: any): eq is { parts: string[]; equals: any[] } => {
    return Array.isArray(eq.equals);
  };
  const isCheckpoint = !!problem.checkpoint;
  const canGetHint = !isCheckpoint && hintsUsedCount < problem.hints.length;


  return (
    <Card className="w-full shadow-lg shadow-primary/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-headline">{problem.title}</CardTitle>
        <Button onClick={onGetHint} variant="ghost" size="icon" disabled={!canGetHint} aria-label="İpucu iste">
            <Lightbulb className={canGetHint ? "text-yellow-400" : "text-muted-foreground"}/>
            {canGetHint && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    {problem.hints.length - hintsUsedCount}
                </span>
            )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {problem.equations.map((eq, index) => (
            <div key={index} className="flex items-center justify-center space-x-2 md:space-x-4 p-4 bg-muted/50 rounded-lg">
              {eq.parts.map((shape, partIndex) => (
                <React.Fragment key={partIndex}>
                  <ShapeIcon shape={shape} className="h-8 w-8 md:h-12 md:w-12 text-accent-foreground" />
                  {partIndex < eq.parts.length - 1 && <Plus className="h-6 w-6 text-muted-foreground" />}
                </React.Fragment>
              ))}
              <Equal className="h-8 w-8 text-primary font-bold" />
              {isRelational(eq) ? (
                 <div className="flex items-center space-x-2">
                    {eq.equals.map((part, i) => {
                        if (typeof part === 'string' && problem.unknowns.includes(part)) {
                            return <ShapeIcon key={i} shape={part} className="h-8 w-8 md:h-12 md:w-12 text-accent-foreground" />;
                        }
                        if (typeof part === 'string' && (part === '+' || part === '-')) {
                            return <span key={i} className="text-3xl font-bold text-muted-foreground mx-2">{part}</span>
                        }
                        return <span key={i} className="text-4xl md:text-5xl font-bold font-headline text-primary">{part}</span>
                    })}
                 </div>
              ) : (
                <span className="text-4xl md:text-5xl font-bold font-headline text-primary">{eq.equals}</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
