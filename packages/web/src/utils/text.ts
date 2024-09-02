export function createTextDataUrl(input: string) {
  return `data:text/plain;charset=utf-8;base64,${input.trim()}`;
}
