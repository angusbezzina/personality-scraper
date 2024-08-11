"use client";

import React from "react";

import { z } from "@personality-scraper/common/validation";
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Textarea, useForm, zodResolver } from "@personality-scraper/components";
import { At, User } from "@phosphor-icons/react/dist/ssr";
import { callPromptAgent } from "@personality-scraper/api/client";
import { downloadTextAsFile } from "@personality-scraper/common/downloadTextFile";

const SocialSchema = z.object({
  name: z.string().min(2, "Please enter a valid name"),
  youtube: z.string().min(2, "Please enter a valid YouTube handle"),
  strategy: z.string().min(100, "Please enter a valid strategy")
});

export function ScrapeProfileForm() {
  const [message, setMessage] = React.useState<string>();
  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver(SocialSchema),
    defaultValues: {
      name: "",
      youtube: "",
      strategy: ""
    },
  });
  const { handleSubmit, reset } = form;

  async function onSubmit(data: z.infer<typeof SocialSchema>) {
    const { name, youtube, strategy } = data;
    const result = await callPromptAgent({ name, socials: { youtube }, strategy });

    if (result) {
      downloadTextAsFile(`${youtube}-prompt`, result);
      setMessage("Boom goes the dynamite... 🧨💥");
      reset();
    } else {
      setMessage("Something went wrong 😔");
    }
  }

  React.useEffect(() => {
    setMessage(undefined);
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col justify-start items-start rounded-md gap-4 md:gap-6 p-4 md:p-8 shadow-lg bg-secondary"
      >
        <h3 className="text-h4 font-bold">Personality Scraper<span className="text-brand">.</span></h3>
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
              <FormLabel className="text-brand">YouTube Handle</FormLabel>
              <FormControl>
                <Input type="text" {...field} iconLeft={<At />} placeholder="userName" />
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
        {message && <p className="py-3">{message}</p>}
      </form>
    </Form>
  );
}
