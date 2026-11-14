/// <reference lib="webworker" />
import { runPipeline } from '../lib/pipeline';
import type { ConverterSettings, GridSize } from '../types';

export interface PipelineRequest {
  id: number;
  key: number;
  grid: GridSize;
  settings: ConverterSettings;
  /** Sent only when the source changes; the worker keeps it for later requests. */
  source?: { bitmap: ImageBitmap; width: number; height: number };
}

let held: { key: number; bitmap: ImageBitmap; width: number; height: number } | null = null;

self.onmessage = (event: MessageEvent<PipelineRequest>) => {
  const { id, key, grid, settings, source } = event.data;
  if (source) {
    held?.bitmap.close();
    held = { key, ...source };
  }
  if (!held || held.key !== key) {
    self.postMessage({ id, error: 'stale-source' });
    return;
  }
  try {
    const result = runPipeline(held, grid, settings);
    self.postMessage({ id, result }, [result.data.buffer]);
  } catch (error) {
    self.postMessage({ id, error: error instanceof Error ? error.message : 'processing failed' });
  }
};
