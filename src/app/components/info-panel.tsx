'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Level } from '@/domain/models/pedagogy';
import { gameText } from '@/app/ui-text/game-text';
import { Users } from 'lucide-react';

interface InfoPanelProps {
  level: Level;
}

export function InfoPanel({ level }: InfoPanelProps) {
  return (
    <Card className="h-full sticky top-20">
      <CardHeader>
        <CardTitle>{level.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {level.instructorNote && (
          <div className="bg-blue-50 border-blue-200 border rounded-lg p-4">
            <h4 className="font-semibold flex items-center gap-2 text-blue-800">
              <Users className="h-5 w-5" />
              {gameText.instructorNote}
            </h4>
            <div className="mt-2 space-y-2 text-blue-700">
              <p className="font-semibold">{gameText.commonErrors}:</p>
              <ul className="list-disc pl-5">
                {level.instructorNote.commonErrors.map((err, i) => <li key={i}>{err.description}</li>)}
              </ul>
              <p className="font-semibold mt-4">{gameText.guidingQuestions}:</p>
              <ul className="list-disc pl-5">
                {level.instructorNote.guidingQuestions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
