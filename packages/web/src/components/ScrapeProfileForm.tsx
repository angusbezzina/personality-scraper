"use client";

import React from "react";
import { Hash, User } from "@phosphor-icons/react/dist/ssr";

import { callPromptAgent } from "@personality-scraper/api/client";
import { downloadTextAsFile } from "@personality-scraper/common/downloadTextFile";
import { z } from "@personality-scraper/common/validation";
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, LoadingSpinner, Textarea, useForm, zodResolver } from "@personality-scraper/components";
import { useAsyncFn } from "@/hooks/useAsyncFn";

const SocialSchema = z.object({
  name: z.string().min(2, "Please enter a valid name"),
  youtube: z.string().min(2, "Please enter a valid YouTube handle"),
  strategy: z.string().min(100, "Please enter a valid strategy").optional()
});

export function ScrapeProfileForm() {
  const [message, setMessage] = React.useState<string>();
  const [{ loading, error }, createPrompt] = useAsyncFn(callPromptAgent);
  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver(SocialSchema),
    defaultValues: {
      name: "",
      youtube: "",
      strategy: undefined
    },
  });
  const { handleSubmit, reset, watch } = form;
  const values = watch();

  async function onSubmit(data: z.infer<typeof SocialSchema>) {
    const { name, youtube, strategy } = data;
    const now = new Date().toISOString();
    const prompt = await createPrompt({ name, socials: { youtube }, strategy });

    if (!error && prompt) {
      downloadTextAsFile(`${youtube}-${now}-prompt`, prompt);
      setMessage("Boom goes the dynamite... 🧨💥");
      reset();
    } else {
      setMessage("Something went wrong 😔");
    }
  }

  React.useEffect(() => {
    setMessage(undefined);
  }, [values]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col justify-start items-start rounded-md gap-4 md:gap-6 p-4 md:p-8 shadow-lg bg-secondary min-h-[482px]"
      >
        <h3 className="text-h4 font-bold">Personality Scraper<span className="text-brand">.</span></h3>
        {loading && <LoadingSpinner size="2.5rem" className="h-full w-full items-center justify-center min-h-[372px]" />}
        {!loading && <>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-brand">Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} placeholder="John Smith" iconLeft={<User />} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="youtube"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-brand">YouTube Channel ID</FormLabel>
              <FormControl>
                <Input type="text" {...field} iconLeft={<Hash />} placeholder="UCzGLDaTu81nJDtWK10MniGg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="strategy"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-brand">Call Strategy</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} className="resize-none" placeholder="I want the AI to sell users products X, Y and Z..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="bg-brand">
          Generate
        </Button>
        {message && <p className="py-3">{message}</p>}</>}
      </form>
    </Form>
  );
}
