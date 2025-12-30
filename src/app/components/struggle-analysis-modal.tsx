'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Zap } from 'lucide-react';
import { analyzeStudentStruggle } from '@/ai/flows/automated-struggle-analysis';
import type { Problem } from '../lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface StruggleAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  problem: Problem | undefined;
  attempts: number;
}

export function StruggleAnalysisModal({ open, onOpenChange, problem, attempts }: StruggleAnalysisModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{ advice: string; resourceLinks: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && problem && !analysis && !isLoading) {
      const runAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const result = await analyzeStudentStruggle({
            problemDescription: `A visual equation problem titled "${problem.title}" with ${problem.equations.length} equations.`,
            attempts: attempts,
            timeSpent: 180, // Mock time spent
            hintUsed: false, // Mock hint usage
          });
          setAnalysis(result);
        } catch (e) {
          console.error(e);
          setError('Could not get analysis. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
      runAnalysis();
    }
  }, [open, problem, analysis, isLoading, attempts]);

  const handleClose = () => {
    onOpenChange(false);
    // Reset for next time
    setTimeout(() => {
        setAnalysis(null);
        setError(null);
    }, 300);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="text-primary" />
            Biraz Zorlandık Galiba?
          </DialogTitle>
          <DialogDescription>
            Zorlanmak öğrenmenin bir parçasıdır. İşte sana yardımcı olabilecek bir tavsiye.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Analiz ediliyor...</span>
            </div>
          )}
          {error && <Alert variant="destructive"><AlertTitle>Hata</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
          {analysis && (
            <Alert>
                <AlertTitle>AI Destekli Tavsiye</AlertTitle>
                <AlertDescription>
                    <p className="mb-4">{analysis.advice}</p>
                    {analysis.resourceLinks.length > 0 && (
                        <div>
                            <strong>Faydalı Kaynaklar:</strong>
                            <ul className="list-disc pl-5 mt-2">
                                {analysis.resourceLinks.map((link, i) => <li key={i}><a href={link} target="_blank" rel="noopener noreferrer" className="underline">{link}</a></li>)}
                            </ul>
                        </div>
                    )}
                </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>Anladım, Devam Et</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
