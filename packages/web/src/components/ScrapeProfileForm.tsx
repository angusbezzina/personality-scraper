"use client";

import React from "react";

import { z } from "@personality-scraper/common/validation";
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Textarea, useForm, zodResolver } from "@personality-scraper/components";
import { At } from "@phosphor-icons/react/dist/ssr";

const SocialSchema = z.object({
  social: z.string().min(2, "Please enter a valid social handle"),
  strategy: z.string().min(100, "Please enter a valid strategy")
});

export function ScrapeProfileForm() {
  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver(SocialSchema),
    defaultValues: {
      social: "",
      strategy: ""
    },
  });
  const { handleSubmit } = form;

  async function onSubmit(data: z.infer<typeof SocialSchema>) {
    const { social } = data;

    console.log("Boom goes the dynamite... 🧨💥", social);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col justify-start items-start rounded-md gap-4 md:gap-6 p-4 md:p-8 shadow-lg bg-secondary"
      >
        <h3 className="text-h4 font-bold">What&apos;s your YouTube handle here</h3>
        <FormField
          control={form.control}
          name="social"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel />
              <FormControl>
                <Input type="text" {...field} iconLeft={<At />} />
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
              <FormLabel />
              <FormControl>
                <Textarea rows={10} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg">
          Generate
        </Button>
      </form>
    </Form>
  );
}
