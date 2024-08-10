import type { Metadata, ResolvingMetadata } from "next";

export namespace NextJs {
  export interface PageProps<TParams = {}, TSearchParams = {}> {
    params: TParams;
    searchParams: TSearchParams;
  }

  export interface LayoutProps<TParams = {}> {
    params: TParams;
    children: React.ReactNode;
  }

  export type GenerateMetadata<TParams = {}, TSearchParams = {}> = (
    props: PageProps<TParams, TSearchParams>,
    parent: ResolvingMetadata,
  ) => Promise<Metadata>;
}
