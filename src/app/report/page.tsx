import { ParentalReport } from "@/app/components/parental-report";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
            <Button asChild variant="ghost">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Oyuna Geri Dön
                </Link>
            </Button>
        </div>
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
