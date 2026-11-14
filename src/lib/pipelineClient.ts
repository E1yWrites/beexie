import PipelineWorker from '../workers/pipeline.worker?worker';
import type { PipelineRequest } from '../workers/pipeline.worker';
import type { ConverterSettings, GridSize, ProcessedImage } from '../types';
import { runPipeline } from './pipeline';

type Source = { bitmap: CanvasImageSource; width: number; height: number };
type Reply = { id: number; result?: ProcessedImage; error?: string };

let worker: Worker | null | undefined;
let nextId = 1;
let nextKey = 1;
let sentKey = 0;
const keys = new WeakMap<object, number>();
const pending = new Map<number, (reply: Reply) => void>();

function canUseWorker(): boolean {
  try {
    return typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined' && Boolean(new OffscreenCanvas(1, 1).getContext('2d'));
  } catch {
    return false;
  }
}

function getWorker(): Worker | null {
  if (worker !== undefined) return worker;
  if (!canUseWorker()) return (worker = null);
  worker = new PipelineWorker();
  worker.onmessage = (event: MessageEvent<Reply>) => {
    pending.get(event.data.id)?.(event.data);
    pending.delete(event.data.id);
  };
  worker.onerror = () => {
    // A worker that cannot start or crashes hands every waiting request back to the main thread for good.
    worker?.terminate();
    worker = null;
    for (const [id, resolve] of pending) resolve({ id, error: 'worker-failed' });
    pending.clear();
  };
  return worker;
}

/**
 * Run the pixel pipeline off the main thread. The source bitmap is copied to the worker once per
 * source; settings changes only send the settings. Falls back to the main thread when OffscreenCanvas
 * or workers are missing, or the worker fails.
 */
export async function processImage(source: Source, grid: GridSize, settings: ConverterSettings): Promise<ProcessedImage> {
  const target = getWorker();
  if (!target) return runPipeline(source, grid, settings);

  let key = keys.get(source.bitmap as object);
  if (!key) {
    key = nextKey++;
    keys.set(source.bitmap as object, key);
  }
  const request: PipelineRequest = { id: nextId++, key, grid, settings };
  const transfer: Transferable[] = [];
  if (key !== sentKey) {
    const bitmap = await createImageBitmap(source.bitmap as ImageBitmapSource);
    request.source = { bitmap, width: source.width, height: source.height };
    transfer.push(bitmap);
    sentKey = key;
  }

  const reply = await new Promise<Reply>((resolve) => {
    pending.set(request.id, resolve);
    target.postMessage(request, transfer);
  });
  if (reply.result) return reply.result;
  if (reply.error === 'stale-source') sentKey = 0;
  return runPipeline(source, grid, settings);
}
