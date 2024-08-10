# Personality Scraper Components

## Getting setup

Run the command `npm i`

Ensure that `components.json` is present at the root level of the monorepo, it should look something like this:

```
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "packages/styles/src/tailwind.config.ts",
    "css": "packages/styles/src/global.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "packages/components/src",
    "utils": "packages/components/src/utils"
  }
}
```

## Installing new components from ShadCN

1. Change to the root directory `cd ../../`.
2. Run the command that is given on ShadCN (an example would be `npx shadcn-ui@latest add form`).
3. Clean up the imports for the new component (i.e. change `packages/components/src/utils` to `../utils`).
4. Move any dependencies from the package.json file at the root level into the package.json at this package level `packages/components/package.json`.
5. Export the new component from `src/index.ts`.
