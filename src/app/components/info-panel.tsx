'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Level, Block } from '@/app/lib/types';
import { Lightbulb, BookOpen, GraduationCap, Check, Users } from 'lucide-react';

interface InfoPanelProps {
  level: Level | undefined;
  block: Block | undefined;
  hints: string[];
  hintsUsed: number;
}

export function InfoPanel({ level, block, hints, hintsUsed }: InfoPanelProps) {
  if (!level || !block) return null;

  return (
    <Tabs defaultValue="level-info" className="w-full h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="level-info"><BookOpen className="w-4 h-4 mr-1" />Seviye</TabsTrigger>
        <TabsTrigger value="hints"><Lightbulb className="w-4 h-4 mr-1"/>İpuçları</TabsTrigger>
        <TabsTrigger value="pedagogy"><GraduationCap className="w-4 h-4 mr-1"/>Pedagoji</TabsTrigger>
      </TabsList>
      <TabsContent value="level-info" className="flex-grow">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{level.title}</CardTitle>
            <CardDescription>{level.focus}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p><strong className="text-foreground">Ana Beceri:</strong> {level.mainSkill}</p>
            <p><strong className="text-foreground">Zihinsel Cümle:</strong> <em>{level.mentalSentence}</em></p>
            <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-base">Hazır mıyım? ({level.title} → {level.nextLevel})</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                    {level.readinessCheck.items.map((item, i) => (
                        <div key={i} className="flex items-start">
                            <Check className="h-4 w-4 mr-2 mt-1 text-primary shrink-0"/>
                            <span>{item}</span>
                        </div>
                    ))}
                    <p className="text-xs text-muted-foreground pt-2">{level.readinessCheck.tip}</p>
                </CardContent>
            </Card>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="hints" className="flex-grow">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>İpuçları</CardTitle>
            <CardDescription>İstediğin ipuçları burada görünecek.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hints.length === 0 ? (
                <p className="text-center text-muted-foreground p-4 bg-muted rounded-md">Bu problem için ipucu bulunmuyor.</p>
            ) : hintsUsed === 0 ? (
                 <p className="text-center text-muted-foreground p-4 bg-muted rounded-md">İpucu istemek için problem başlığındaki ampul ikonuna tıkla.</p>
            ): (
                <div className="space-y-2">
                {Array.from({ length: hintsUsed }).map((_, i) => (
                    <p key={i} className="p-3 bg-secondary rounded-md text-secondary-foreground text-sm">
                    <strong className="text-primary-foreground/80">İpucu {i + 1}:</strong> {hints[i]}
                    </p>
                ))}
                </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="pedagogy" className="flex-grow">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Neden Bu Blok Önemli?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: block.rationale }} />

            <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="p-4">
                     <CardTitle className="text-base flex items-center gap-2"><Users className="h-5 w-5"/>Eğitmen Notu</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                    <p className="font-semibold">Normal Olan Hatalar:</p>
                    <ul className="list-disc pl-5">
                        {level.instructorNote.commonErrors.map((err, i) => <li key={i}>{err}</li>)}
                    </ul>
                     <p className="font-semibold">Yönlendirme Soruları:</p>
                    <ul className="list-disc pl-5">
                        {level.instructorNote.guidingQuestions.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                </CardContent>
            </Card>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
