'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ShapeIcon } from './icons';
import { Problem } from '@/domain/models/problem';
import { gameText } from '@/app/ui-text/game-text';

interface AnswerFormProps {
  problem: Problem;
  onSubmit: (data: Record<string, number>) => void;
}

export function AnswerForm({ problem, onSubmit }: AnswerFormProps) {
  // Dynamically create a Zod schema based on the unknowns in the problem.
  const schemaObject = problem.unknowns.reduce((acc, shape) => {
    acc[shape] = z.coerce.number({ invalid_type_error: gameText.enterNumberError });
    return acc;
  }, {} as Record<string, z.ZodType<any, any>>);

  const formSchema = z.object(schemaObject);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // Set default values for the form fields.
    defaultValues: problem.unknowns.reduce((acc, shape) => {
      acc[shape] = '';
      return acc;
    }, {} as Record<string, any>),
  });

  // The form is automatically reset when the problem changes, so we watch the problem ID.
  // This is a cleaner approach than manually resetting the form.
  const problemId = problem.id;
  useEffect(() => {
    form.reset();
  }, [problemId, form]);

  // The form no longer needs to know if the problem is solved.
  // It simply submits the data. The orchestrator handles the rest.
  return (
    <Card className="shadow-lg shadow-primary/5">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <Button type="submit" className="w-full" size="lg">
              {gameText.submitButton}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
