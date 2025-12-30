'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Problem, Solution } from '@/app/lib/types';
import { ShapeIcon } from './icons';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface AnswerFormProps {
  problem: Problem;
  onSubmit: (data: Partial<Solution>) => boolean;
  onNextProblem: () => void;
  isSolved: boolean;
}

export function AnswerForm({ problem, onSubmit, onNextProblem, isSolved }: AnswerFormProps) {
  const schemaObject = problem.unknowns.reduce((acc, shape) => {
    acc[shape] = z.coerce.number({ invalid_type_error: 'Sayı girin' });
    return acc;
  }, {} as Record<string, z.ZodType<any, any>>);

  const formSchema = z.object(schemaObject);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: problem.unknowns.reduce((acc, shape) => {
      acc[shape] = '';
      return acc;
    }, {} as Record<string, any>),
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    const success = onSubmit(values);
    if(success) {
      form.reset();
    }
  }

  if (isSolved) {
    return (
        <Card>
            <CardContent className="p-6 flex flex-col items-center gap-4">
                <h3 className="text-xl font-semibold text-primary">Harika! Problemi Çözdün.</h3>
                <Button onClick={onNextProblem} size="lg">
                    Sonraki Probleme Geç <ArrowRight className="ml-2" />
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
              {problem.unknowns.map((shape) => (
                <FormField
                  key={shape}
                  control={form.control}
                  name={shape}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-center">
                        <ShapeIcon shape={shape} className="h-10 w-10 text-accent-foreground" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="?"
                          className="text-center text-2xl font-bold h-14"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage className="text-center"/>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={problem.checkpoint && isSolved}>
              Cevabı Kontrol Et
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
