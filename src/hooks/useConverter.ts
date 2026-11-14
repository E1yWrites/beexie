import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_SETTINGS, MAX_GRID, MAX_OUTPUT_DIMENSION } from '../constants';
import { processColors } from '../lib/colors';
import { paintPixel, pixelAt } from '../lib/edits';
import { clampInteger, computeAutoOutput, computeGrid, derivedPixelSize, gridFromPixelSize } from '../lib/dimensions';
import { loadSourceImage, releaseSource } from '../lib/image';
import { rasterizeToGrid } from '../lib/pixelate';
import { validateFile } from '../lib/validation';
import type {
  ConverterSettings,
  Rgb,
  GridPreset,
  GridSize,
  ProcessedImage,
  SourceImage,
  Stage,
} from '../types';

export type GridSide = 'width' | 'height';

export interface ConverterController {
  source: SourceImage | null;
  settings: ConverterSettings;
  grid: GridSize;
  pixelSize: number;
  processed: ProcessedImage | null;
  busy: boolean;
  error: string | null;
  loadFile: (file: File) => Promise<SourceImage | null>;
  clearImage: () => void;
  resetSettings: () => void;
  resetStage: (stage: Stage) => void;
  updateSettings: (patch: Partial<ConverterSettings>) => void;
  setPreset: (preset: GridPreset) => void;
  setPixelSize: (size: number) => void;
  setGridDimension: (side: GridSide, value: number) => void;
  setGridAspectLocked: (locked: boolean) => void;
  setOutputDimension: (side: GridSide, value: number) => void;
  setOutputAuto: () => void;
  dismissError: () => void;
  canUndo: boolean;
  beginStroke: () => void;
  paint: (x: number, y: number, color: Rgb | null) => void;
  pick: (x: number, y: number) => Rgb | null;
  undo: () => void;
}

export function useConverter(): ConverterController {
  const [source, setSource] = useState<SourceImage | null>(null);
  const [settings, setSettings] = useState<ConverterSettings>(DEFAULT_SETTINGS);
  const [processed, setProcessed] = useState<ProcessedImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [undoDepth, setUndoDepth] = useState(0);
  // Touch-up edits live in `processed` and are discarded when settings re-process the image.
  const historyRef = useRef<ProcessedImage[]>([]);
  const processedRef = useRef<ProcessedImage | null>(null);
  processedRef.current = processed;

  const sourceRef = useRef<SourceImage | null>(null);
  const requestRef = useRef(0);

  const grid = useMemo(
    () => computeGrid(source ? { width: source.width, height: source.height } : null, settings),
    [source, settings.resolutionMode, settings.preset, settings.customGrid.width, settings.customGrid.height],
  );

  const pixelSize = useMemo(
    () => (source ? derivedPixelSize(source, grid) : 1),
    [source, grid.width, grid.height],
  );

  useEffect(() => {
    if (!settings.outputAuto) return;
    const auto = computeAutoOutput(grid);
    setSettings((previous) =>
      previous.outputWidth === auto.width && previous.outputHeight === auto.height
        ? previous
        : { ...previous, outputWidth: auto.width, outputHeight: auto.height },
    );
  }, [grid.width, grid.height, settings.outputAuto]);

  const paletteKey = settings.customPalette.join('|');

  useEffect(() => {
    if (!source) {
      setProcessed(null);
      setBusy(false);
      return;
    }

    let cancelled = false;
    setBusy(true);

    const timer = window.setTimeout(() => {
      try {
        const raster = rasterizeToGrid(
          source.bitmap,
          source.width,
          source.height,
          grid.width,
          grid.height,
          settings.transparentBackground ? null : settings.backgroundColor,
        );
        const result = processColors(raster, {
          mode: settings.colorMode,
          reducedColors: settings.reducedColors,
          customPalette: settings.customPalette,
          quantization: settings.quantization,
          dithering: settings.dithering,
          ditherMode: settings.ditherMode,
          transparentBackground: settings.transparentBackground,
          backgroundColor: settings.backgroundColor,
          retroPreset: settings.retroPreset,
        });
        if (!cancelled) {
          historyRef.current = [];
          setUndoDepth(0);
          setProcessed(result);
          setError(null);
        }
      } catch {
        if (!cancelled) setError('The image could not be processed. Try a smaller file or another format.');
      } finally {
        if (!cancelled) setBusy(false);
      }
    }, 60);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // The palette key stands in for the array; every pixel-affecting setting is listed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    source,
    grid.width,
    grid.height,
    settings.colorMode,
    settings.reducedColors,
    paletteKey,
    settings.quantization,
    settings.dithering,
    settings.ditherMode,
    settings.transparentBackground,
    settings.backgroundColor,
    settings.retroPreset,
  ]);

  const loadFile = useCallback(async (file: File) => {
    const validation = validateFile(file);
    if (!validation.ok) {
      setError(validation.error);
      return null;
    }

    const request = requestRef.current + 1;
    requestRef.current = request;
    setBusy(true);

    try {
      const next = await loadSourceImage(file);
      if (request !== requestRef.current) {
        releaseSource(next);
        return null;
      }
      if (sourceRef.current) releaseSource(sourceRef.current);
      sourceRef.current = next;
      setProcessed(null);
      setSource(next);
      setSettings((previous) => ({ ...previous, outputAuto: true }));
      setError(null);
      return next;
    } catch (loadError) {
      if (request === requestRef.current) {
        setError(loadError instanceof Error ? loadError.message : 'Could not load that image.');
      }
      return null;
    } finally {
      if (request === requestRef.current) setBusy(false);
    }
  }, []);

  const clearImage = useCallback(() => {
    requestRef.current += 1;
    releaseSource(sourceRef.current);
    sourceRef.current = null;
    setSource(null);
    setProcessed(null);
    setError(null);
    setBusy(false);
  }, []);

  const resetSettings = useCallback(() => {
    const resetGrid = computeGrid(
      source ? { width: source.width, height: source.height } : null,
      DEFAULT_SETTINGS,
    );
    const auto = computeAutoOutput(resetGrid);
    setSettings({
      ...DEFAULT_SETTINGS,
      customGrid: { ...DEFAULT_SETTINGS.customGrid },
      customPalette: [...DEFAULT_SETTINGS.customPalette],
      outputWidth: auto.width,
      outputHeight: auto.height,
    });
    setError(null);
  }, [source]);

  const resetStage = useCallback(
    (stage: Stage) => {
      if (stage === 'image') {
        clearImage();
        return;
      }

      setSettings((previous) => {
        let next: ConverterSettings = { ...previous };

        if (stage === 'grid') {
          next = {
            ...next,
            resolutionMode: DEFAULT_SETTINGS.resolutionMode,
            preset: DEFAULT_SETTINGS.preset,
            customGrid: { ...DEFAULT_SETTINGS.customGrid },
            gridAspectLocked: DEFAULT_SETTINGS.gridAspectLocked,
          };
        }

        if (stage === 'color') {
          next = {
            ...next,
            colorMode: DEFAULT_SETTINGS.colorMode,
            reducedColors: DEFAULT_SETTINGS.reducedColors,
            customPalette: [...DEFAULT_SETTINGS.customPalette],
            quantization: DEFAULT_SETTINGS.quantization,
            dithering: DEFAULT_SETTINGS.dithering,
            ditherMode: DEFAULT_SETTINGS.ditherMode,
            gridOverlay: DEFAULT_SETTINGS.gridOverlay,
            transparentBackground: DEFAULT_SETTINGS.transparentBackground,
            backgroundColor: DEFAULT_SETTINGS.backgroundColor,
            retroPreset: DEFAULT_SETTINGS.retroPreset,
          };
        }

        if (stage === 'finish') {
          next = {
            ...next,
            format: DEFAULT_SETTINGS.format,
            scale: DEFAULT_SETTINGS.scale,
            quality: DEFAULT_SETTINGS.quality,
            outputAspectLocked: DEFAULT_SETTINGS.outputAspectLocked,
          };
        }

        if (stage === 'grid' || stage === 'finish') {
          const auto = computeAutoOutput(
            computeGrid(source ? { width: source.width, height: source.height } : null, next),
          );
          next = { ...next, outputAuto: true, outputWidth: auto.width, outputHeight: auto.height };
        }

        return next;
      });
      setError(null);
    },
    [clearImage, source],
  );

  const updateSettings = useCallback((patch: Partial<ConverterSettings>) => {
    setSettings((previous) => ({ ...previous, ...patch }));
  }, []);

  const setPreset = useCallback((preset: GridPreset) => {
    setSettings((previous) => ({ ...previous, resolutionMode: 'preset', preset }));
  }, []);

  const setPixelSize = useCallback(
    (size: number) => {
      if (!source) return;
      const customGrid = gridFromPixelSize(source, size);
      setSettings((previous) => ({ ...previous, resolutionMode: 'custom', customGrid }));
    },
    [source],
  );

  const setGridDimension = useCallback(
    (side: GridSide, rawValue: number) => {
      const value = clampInteger(rawValue, 1, MAX_GRID);
      setSettings((previous) => {
        const current = computeGrid(source ? { width: source.width, height: source.height } : null, previous);
        let width = side === 'width' ? value : current.width;
        let height = side === 'height' ? value : current.height;
        if (previous.gridAspectLocked && source) {
          const ratio = source.width / source.height;
          if (side === 'width') height = clampInteger(value / ratio, 1, MAX_GRID);
          else width = clampInteger(value * ratio, 1, MAX_GRID);
        }
        return {
          ...previous,
          resolutionMode: 'custom',
          customGrid: { width, height },
        };
      });
    },
    [source],
  );

  const setGridAspectLocked = useCallback(
    (locked: boolean) => {
      setSettings((previous) => {
        if (!locked || !source) return { ...previous, gridAspectLocked: locked };
        const current = computeGrid({ width: source.width, height: source.height }, previous);
        const ratio = source.width / source.height;
        return {
          ...previous,
          gridAspectLocked: true,
          resolutionMode: 'custom',
          customGrid: {
            width: current.width,
            height: clampInteger(current.width / ratio, 1, MAX_GRID),
          },
        };
      });
    },
    [source],
  );

  const setOutputDimension = useCallback((side: GridSide, rawValue: number) => {
    const value = clampInteger(rawValue, 1, MAX_OUTPUT_DIMENSION);
    setSettings((previous) => {
      let width = side === 'width' ? value : previous.outputWidth;
      let height = side === 'height' ? value : previous.outputHeight;
      if (previous.outputAspectLocked) {
        const ratio = previous.outputWidth / previous.outputHeight || 1;
        if (side === 'width') height = clampInteger(value / ratio, 1, MAX_OUTPUT_DIMENSION);
        else width = clampInteger(value * ratio, 1, MAX_OUTPUT_DIMENSION);
      }
      return { ...previous, outputAuto: false, outputWidth: width, outputHeight: height };
    });
  }, []);

  const setOutputAuto = useCallback(() => {
    setSettings((previous) => {
      const auto = computeAutoOutput(
        computeGrid(source ? { width: source.width, height: source.height } : null, previous),
      );
      return { ...previous, outputAuto: true, outputWidth: auto.width, outputHeight: auto.height };
    });
  }, [source]);

  const dismissError = useCallback(() => setError(null), []);

  const beginStroke = useCallback(() => {
    if (!processedRef.current) return;
    historyRef.current = [...historyRef.current.slice(-49), processedRef.current];
    setUndoDepth(historyRef.current.length);
  }, []);

  const paint = useCallback((x: number, y: number, color: Rgb | null) => {
    setProcessed((previous) => (previous ? paintPixel(previous, x, y, color) : previous));
  }, []);

  const pick = useCallback((x: number, y: number) => {
    const current = processedRef.current;
    return current ? pixelAt(current, x, y) : null;
  }, []);

  const undo = useCallback(() => {
    const previous = historyRef.current.at(-1);
    if (!previous) return;
    historyRef.current = historyRef.current.slice(0, -1);
    setUndoDepth(historyRef.current.length);
    setProcessed(previous);
  }, []);

  useEffect(() => {
    sourceRef.current = source;
  }, [source]);

  useEffect(
    () => () => {
      releaseSource(sourceRef.current);
      sourceRef.current = null;
    },
    [],
  );

  return {
    source,
    settings,
    grid,
    pixelSize,
    processed,
    busy,
    error,
    loadFile,
    clearImage,
    resetSettings,
    resetStage,
    updateSettings,
    setPreset,
    setPixelSize,
    setGridDimension,
    setGridAspectLocked,
    setOutputDimension,
    setOutputAuto,
    dismissError,
    canUndo: undoDepth > 0,
    beginStroke,
    paint,
    pick,
    undo,
  };
}
