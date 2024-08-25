"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { User } from "@phosphor-icons/react/dist/ssr";

import { callPromptAgent, getTranscripts, useAuth } from "@personality-scraper/api/client";
import { downloadTextAsFile } from "@personality-scraper/common/downloadTextFile";
import { z } from "@personality-scraper/common/validation";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  LoadingSpinner,
  Textarea,
  useForm,
  zodResolver,
} from "@personality-scraper/components";

import { useAsyncFn } from "../hooks/useAsyncFn";

const SocialSchema = z.object({
  name: z.string().min(2, "Please enter a valid name"),
  strategy: z.string().min(100, "Please enter a valid strategy").optional(),
});

export function ScrapeProfileForm() {
  const { signIn, signOut } = useAuth();
  const session = useSession();
  const [message, setMessage] = React.useState<string>();
  const [{ loading, error }, createPrompt] = useAsyncFn(callPromptAgent);
  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver(SocialSchema),
    defaultValues: {
      name: session.data?.user?.name || "",
      strategy: undefined,
    },
  });
  const { handleSubmit, reset, watch } = form;
  const { name, strategy } = watch();

  async function onSubmit(data: z.infer<typeof SocialSchema>) {
    const { accessToken } = session.data || {};
    const { name, strategy } = data;

    if (!accessToken) {
      setMessage("Whoops... you need to sign in to scrape profiles");
    } else {
      const now = new Date().toISOString();
      const youtube = await getTranscripts(accessToken);
      const prompt = await createPrompt({ name, rag: { youtube: youtube.join(", ") }, strategy });

      if (!error && prompt) {
        downloadTextAsFile(`${youtube}-${now}-prompt`, prompt);
        setMessage("Boom goes the dynamite... 🧨💥");
        reset();
      } else {
        setMessage("Something went wrong 😔");
      }
    }
  }

  async function handleSignIn(e: React.MouseEvent) {
    e.preventDefault();
    await signIn();
  }

  async function handleSignOut(e: React.MouseEvent) {
    e.preventDefault();
    await signOut();
  }

  React.useEffect(() => {
    setMessage(undefined);
  }, [name, strategy, session.data?.accessToken]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col justify-start items-start rounded-md gap-4 md:gap-6 p-4 md:p-8 shadow-lg bg-secondary min-h-[482px]"
      >
        <div className="flex flex-col gap-3">
          <h1 className="text-h2 font-bold">
            Creator<span className="text-brand">X</span>
          </h1>
          <h3 className="text-h4 font-bold">
            <span className="text-brand">Personality Scraper</span>.
          </h3>
        </div>
        {loading && (
          <LoadingSpinner
            size="2.5rem"
            className="h-full w-full items-center justify-center min-h-[372px]"
          />
        )}
        {!loading && (
          <>
            {!session.data?.accessToken ? (
              <Button type="button" onClick={handleSignIn}>
                Connect YouTube
              </Button>
            ) : (
              <Button variant="outline" type="button" onClick={handleSignOut}>
                Disconnect YouTube
              </Button>
            )}
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
              name="strategy"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-brand">Call Strategy</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      {...field}
                      className="resize-none"
                      placeholder="I want the AI to sell users products X, Y and Z..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="bg-brand">
              Generate
            </Button>
            {message && <p className="py-3">{message}</p>}
          </>
        )}
      </form>
    </Form>
  );
}
