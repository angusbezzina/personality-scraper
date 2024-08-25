type Param = string | number | boolean | string[] | null | undefined;

type QueryParams = Record<string, Param>;

function toString(val: Param): string {
  if (val === null || typeof val === "undefined") {
    return "";
  }

  return Array.isArray(val) ? val.join(",") : val?.toString();
}

export function getPathWithParams(path: string, params: QueryParams = {}): string {
  return Object.entries(params).reduce((prev, [key, value]) => {
    return (
      prev
        // /my/[dynamic]/path
        .replace(`[${key}]`, encodeURIComponent(toString(value)))
        // /my/:dynamic/path
        .replace(`:${key}`, encodeURIComponent(toString(value)))
    );
  }, path) as string;
}

export function getPathWithQuery(path: string, params: QueryParams = {}): string {
  const [base = "", existingQuery] = path.split("?");
  const searchParams = new URLSearchParams(existingQuery);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, value.toString());
    }
  });

  const query = searchParams.toString();

  return (query ? `${base}?${query}` : path) as string;
}
