'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { generateProgressReport } from "@/ai/flows/progress-and-insights-report";
import { useToast } from "@/hooks/use-toast";

export function ParentalReport() {
    const [report, setReport] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const fetchReport = async () => {
        setIsLoading(true);
        try {
            // Mock data, in a real app this would come from the game state/backend
            const reportData = {
                studentName: "Alex",
                challengesCompleted: 5,
                patienceScore: 78,
                strategyAdaptationScore: 85,
                focusScore: 92,
                strengths: "değişkenleri hızlıca izole etme, temel aritmetik",
                struggles: "çok adımlı problemleri takip etme, ondalık sayılarla çalışma"
            };
            const result = await generateProgressReport(reportData);
            setReport(result.report);
        } catch (error) {
            console.error("Failed to generate report:", error);
            toast({
                title: "Error",
                description: "Could not generate the report. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="space-y-6">
             <div className="flex justify-end">
                <Button onClick={fetchReport} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Raporu Yenile
                </Button>
            </div>
            {isLoading && !report ? (
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                    <span className="text-muted-foreground">Rapor oluşturuluyor...</span>
                </div>
            ) : report ? (
                <Alert>
                    <AlertTitle>Beceri Özeti</AlertTitle>
                    <AlertDescription className="prose prose-sm max-w-none">
                       <div dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br />') }} />
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="text-center text-muted-foreground p-8">
                    Raporu oluşturmak için butona tıklayın.
                </div>
            )}
        </div>
    );
}
