import { Manifest } from "./@types";

export function createFromManifest(manifest: Manifest): Promise<Manifest> {
  return Promise.resolve(manifest);
}
