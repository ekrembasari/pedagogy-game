import { ParentalReport } from "../components/parental-report";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-headline">Ebeveyn Raporu</CardTitle>
                <CardDescription>Öğrencinin ilerlemesi, güçlü yönleri ve gelişim alanları hakkında bir özet.</CardDescription>
            </CardHeader>
            <CardContent>
                <ParentalReport />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
