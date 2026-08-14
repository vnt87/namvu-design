import { existsSync } from 'node:fs';
import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import type { ToolPackConfig } from './config.js';

export interface WebSourcemapOptions { releaseVersion?: string }

function browserChunksDir(workspaceRoot: string): string {
  return join(workspaceRoot, 'apps', 'web', '.next', 'static');
}

async function findMapFiles(dir: string): Promise<string[]> {
  const maps: string[] = [];
  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    let entries;
    try { entries = await readdir(current, { withFileTypes: true }); } catch { continue; }
    for (const entry of entries) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) stack.push(path);
      else if (entry.isFile() && entry.name.endsWith('.map')) maps.push(path);
    }
  }
  return maps;
}

/** Strip browser source maps before packaging. No map or build metadata is uploaded. */
export async function processWebSourcemaps(
  config: ToolPackConfig,
  _options: WebSourcemapOptions = {},
): Promise<void> {
  const chunksDir = browserChunksDir(config.workspaceRoot);
  if (!existsSync(chunksDir)) return;
  const maps = await findMapFiles(chunksDir);
  for (const path of maps) await rm(path, { force: true });
  process.stderr.write(`[web-sourcemaps] stripped ${maps.length} .map file(s); remote upload disabled\n`);
}
