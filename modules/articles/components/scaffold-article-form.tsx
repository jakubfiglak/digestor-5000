'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils/cn';

import { scaffoldArticle } from '../actions';

const formSchema = z.object({
  title: z.string().nonempty(),
});

type ScaffoldArticleFormProps = {
  className?: string;
};

export const ScaffoldArticleForm = ({
  className,
}: ScaffoldArticleFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const { toast } = useToast();

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-4', className)}
        onSubmit={form.handleSubmit(async (data) => {
          setIsLoading(true);

          const result = await scaffoldArticle(data);

          toast({
            title: result.success ? 'Article scaffolded' : 'Error',
            description: result.message,
            variant: result.success ? 'default' : 'destructive',
          });

          if (result.success) {
            form.reset();
          }

          setIsLoading(false);
        })}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          Submit 🚀
          {isLoading && <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
};
