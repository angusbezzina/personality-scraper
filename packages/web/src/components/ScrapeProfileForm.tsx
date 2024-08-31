"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { User, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";

import {
  createPersonalityPrompt,
  getDownloadUrl,
  getTranscripts,
  useAuth,
} from "@personality-scraper/api/client";
import { slugify } from "@personality-scraper/common/slugify";
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
import type { PersonalityScraper } from "@personality-scraper/types";

import { useAsyncFn } from "../hooks/useAsyncFn";

import { useDownloadFiles } from "@/hooks/useDownloadFiles";

const SocialSchema = z.object({
  name: z.string().min(2, "Please enter a valid name"),
  strategy: z.string().min(100, "Please enter a valid strategy").optional(),
});

export function ScrapeProfileForm() {
  const { loading: authLoading, signIn, signOut } = useAuth();
  const session = useSession();
  const downloadFiles = useDownloadFiles();
  const [message, setMessage] = React.useState<string>();
  const [{ loading, error }, createPrompt] = useAsyncFn(createPersonalityPrompt);
  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver(SocialSchema),
    defaultValues: {
      name: session.data?.user?.name || "",
      strategy: undefined,
    },
  });
  const {
    handleSubmit,
    reset,
    watch,
    formState: { isValid, isDirty },
  } = form;
  const { name, strategy } = watch();

  async function onSubmit(data: z.infer<typeof SocialSchema>) {
    const { accessToken } = session.data || {};
    const { name, strategy } = data;

    if (!accessToken) {
      setMessage("Whoops... you need to sign in to scrape profiles");
    } else {
      const now = new Date().toISOString();
      const youtube = await getTranscripts(accessToken);
      const promptOutput = await createPrompt({
        name,
        rag: { youtube: youtube.join("\n") },
        strategy,
      });

      if (error) {
        setMessage("Something went wrong 😔");

        return;
      }

      const { prompt, knowledgeBase = [] } = promptOutput;

      const promptFile = new Blob([prompt], { type: "text/plain" });
      const promptInput = {
        file: promptFile,
        filename: `${slugify(name)}-${now}-prompt.txt`,
      };

      const knowledgeBaseInputs = await Promise.all(
        knowledgeBase.map(async (path, index) => {
          const url = (await getDownloadUrl(path)) as PersonalityScraper.Url;
          const response = await fetch(url);
          const file = await response.blob();

          return {
            file,
            filename: `${slugify(name)}-knowledgebase-${index + 1}.txt`,
          };
        }),
      );

      const fileInputs = [promptInput, ...knowledgeBaseInputs];
      console.log(fileInputs);

      downloadFiles(fileInputs);

      setMessage("Boom goes the dynamite... 🧨💥");
      reset();
    }
  }

  async function handleSignIn(e: React.MouseEvent) {
    e.preventDefault();
    await signIn();
  }

  async function handleSignOut(e: React.MouseEvent) {
    e.preventDefault();
    await signOut();
    // NOTE: Hack to reflect session change more quickly
    window.location.reload();
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
              <Button type="button" disabled={authLoading} onClick={handleSignIn}>
                <YoutubeLogo size={20} className="mr-2" />
                Connect YouTube
              </Button>
            ) : (
              <Button
                disabled={authLoading}
                variant="destructive"
                type="button"
                onClick={handleSignOut}
              >
                <YoutubeLogo size={20} className="mr-2" />
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
            <Button disabled={!isValid && !isDirty} type="submit" size="lg" className="bg-brand">
              Generate
            </Button>
            {message && <p className="py-3">{message}</p>}
          </>
        )}
      </form>
    </Form>
  );
}
