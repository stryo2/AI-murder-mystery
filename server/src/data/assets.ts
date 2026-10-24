// Art paths in case.json are relative to client/public/assets; the client needs URLs.
export function assetUrl(path: string | undefined): string | undefined {
  return path && `/assets/${path}`;
}
