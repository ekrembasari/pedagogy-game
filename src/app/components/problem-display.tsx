'use client';
import React from 'react';
import type { Problem } from '@/app/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShapeIcon } from './icons';
import { Plus, Equal } from 'lucide-react';

export function ProblemDisplay({ problem }: { problem: Problem }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">{problem.title}</CardTitle>
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
              <span className="text-4xl md:text-5xl font-bold font-headline text-primary">{eq.equals}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
