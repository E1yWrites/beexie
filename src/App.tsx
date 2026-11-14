import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Toast, type ToastData, type ToastTone } from './components/Toast';
import { Inspector } from './components/inspector/Inspector';
import { AppHeader } from './components/shell/AppHeader';
import { ToolRail } from './components/shell/ToolRail';
import { convertBatch } from './lib/batch';
import { Workspace } from './components/workspace/Workspace';
import { LandingPage } from './components/landing/LandingPage';
import { ACCEPT_ATTRIBUTE, MAX_EXPORT_DIMENSION } from './constants';
import { useConverter } from './hooks/useConverter';
import { useTheme } from './hooks/useTheme';
import { useTool } from './hooks/useTool';
import { computeExportSize, isExportSizeValid } from './lib/dimensions';
import { drawChart } from './lib/chart';
import { buildExportFilename, downloadPixelArt, saveBlob } from './lib/export';
import { canvasToBlob } from './lib/pixelate';
import { STAGE_LABELS } from './lib/stages';
import { ticketDisabledReason } from './lib/ticket';
import { UploadIcon } from './components/icons';
import { ExportTicket } from './components/inspector/ExportTicket';

export default function App() {
  const converter = useConverter();
  const { theme, toggleTheme } = useTheme();
  const { active, visited, open, reset: resetStages } = useTool();
  const [view, setView] = useState<'landing' | 'studio'>('landing');
  const [toast, setToast] = useState<ToastData | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [savedAt, setSavedAt] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { source, settings, processed, grid } = converter;

  const notify = useCallback((message: string, tone: ToastTone = 'info') => {
    setToast({ id: Date.now() + Math.random(), message, tone });
  }, []);

  const finalSize = useMemo(
    () => computeExportSize({ width: settings.outputWidth, height: settings.outputHeight }, settings.scale),
    [settings.outputWidth, settings.outputHeight, settings.scale],
  );

  const disabledReason = ticketDisabledReason({
    hasImage: Boolean(source) && Boolean(processed),
    size: finalSize,
  });

  const pickFile = useCallback(() => fileInputRef.current?.click(), []);

  const handleFile = useCallback(
    async (file: File) => {
      const loaded = await converter.loadFile(file);
      if (loaded) {
        setView('studio');
        open('image');
        notify(`Loaded ${loaded.name} · ${loaded.width} × ${loaded.height} px`, 'success');
      } else {
        setView('studio');
      }
    },
    [converter.loadFile, notify, open],
  );

  const handleLoadSample = useCallback(async () => {
    try {
      const res = await fetch('/specimen.jpg');
      const blob = await res.blob();
      const sampleFile = new File([blob], 'koi-pond-specimen.jpg', { type: 'image/jpeg' });
      await handleFile(sampleFile);
    } catch {
      notify('Could not load sample specimen.', 'error');
    }
  }, [handleFile, notify]);

  const handleFiles = useCallback(
    async (list: FileList | File[] | null | undefined) => {
      const files = Array.from(list ?? []);
      if (files.length < 2) {
        if (files[0]) await handleFile(files[0]);
        return;
      }
      setView('studio');
      setDownloading(true);
      notify(`Converting ${files.length} images with the current settings...`, 'info');
      try {
        const { blob, converted, skipped } = await convertBatch(files, converter.settings);
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'pixel-batch.zip';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 2_000);
        notify(
          `Batch done: ${converted} images + sheet.png in pixel-batch.zip${skipped.length ? `. Skipped: ${skipped.join(', ')}` : ''}`,
          skipped.length ? 'info' : 'success',
        );
      } catch (error) {
        notify(error instanceof Error ? error.message : 'Batch conversion failed.', 'error');
      } finally {
        setDownloading(false);
      }
    },
    [handleFile, converter.settings, notify],
  );

  // Validation and decode failures belong on the Image stage, where the fix lives.
  useEffect(() => {
    if (converter.error) {
      setView('studio');
      open('image');
    }
  }, [converter.error, open]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 5_200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;
      for (let index = 0; index < items.length; index += 1) {
        const item = items[index];
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            event.preventDefault();
            void handleFile(file);
          }
          return;
        }
      }
    };

    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [handleFile]);

  useEffect(() => {
    const hasFiles = (event: DragEvent) => Array.from(event.dataTransfer?.types ?? []).includes('Files');

    const onDragEnter = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      dragDepth.current += 1;
      setDragging(true);
    };
    const onDragOver = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    };
    const onDragLeave = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      dragDepth.current = Math.max(0, dragDepth.current - 1);
      if (dragDepth.current === 0) setDragging(false);
    };
    const onDrop = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      dragDepth.current = 0;
      setDragging(false);
      void handleFiles(event.dataTransfer?.files);
    };

    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('dragleave', onDragLeave);
    // Capture-phase reset: a drop target that stops propagation (the landing cover) must still clear the overlay.
    const onDropCapture = () => {
      dragDepth.current = 0;
      setDragging(false);
    };
    window.addEventListener('drop', onDropCapture, true);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('drop', onDropCapture, true);
      window.removeEventListener('drop', onDrop);
    };
  }, [handleFiles]);

  const handleNewProject = () => {
    if (source && !window.confirm('Start a new project? The current image and settings will be cleared.')) return;
    converter.clearImage();
    converter.resetSettings();
    resetStages();
    notify('New project ready. Drop a specimen to begin.', 'info');
  };

  const handleDownload = useCallback(async () => {
    if (!processed || !source) {
      notify('No image on the bench yet.', 'error');
      return;
    }
    if (!isExportSizeValid(finalSize, MAX_EXPORT_DIMENSION)) {
      notify(`Output exceeds ${MAX_EXPORT_DIMENSION} px per side. Lower the scale.`, 'error');
      return;
    }

    setDownloading(true);
    try {
      const result = await downloadPixelArt({
        processed,
        size: finalSize,
        format: settings.format,
        quality: settings.quality,
        backgroundColor: settings.backgroundColor,
        transparent: settings.transparentBackground,
        sourceName: source.name,
      });
      notify(`Downloaded ${result.filename}`, 'success');
      setSavedAt(Date.now());
    } catch (error) {
      notify(error instanceof Error ? error.message : 'The download failed. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  }, [processed, source, finalSize, settings, notify]);

  const handleChart = useCallback(async () => {
    if (!processed || !source) return;
    try {
      const canvas = drawChart(processed);
      const blob = await canvasToBlob(canvas, 'image/png');
      const filename = buildExportFilename(source.name, processed.width, processed.height, 'png').replace('-pixel-', '-chart-');
      canvas.width = 0;
      saveBlob(blob, filename);
      notify(`Downloaded ${filename}`, 'success');
    } catch {
      notify('The chart could not be drawn. Try a smaller grid.', 'error');
    }
  }, [processed, source, notify]);

  const handleResetStage = () => {
    converter.resetStage(active);
    if (active === 'image') {
      notify('Reset Image: the bench is clear.', 'info');
      return;
    }
    notify(`Reset ${STAGE_LABELS[active]} to defaults.`, 'info');
  };

  if (view === 'landing') {
    return (
      <>
        <LandingPage
          theme={theme}
          onToggleTheme={toggleTheme}
          onFileSelect={(file) => void handleFile(file)}
          onLaunchStudio={() => setView('studio')}
          hasActiveProject={Boolean(source)}
          activeFilename={source?.name}
        />
        <input
          ref={fileInputRef}
          className="visually-hidden"
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          aria-label="Choose an image file to convert"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
            event.target.value = '';
          }}
        />
        {dragging ? (
          <div className="drop-overlay" aria-hidden="true">
            <div className="drop-card">
              <UploadIcon size={28} />
              <strong>Drop it on the page</strong>
              <span>PNG, JPG or WEBP · up to 30 MB</span>
            </div>
          </div>
        ) : null}
        <Toast toast={toast} onDismiss={() => setToast(null)} />
      </>
    );
  }

  return (
    <div className="app" data-stage={active}>
      <AppHeader
        theme={theme}
        source={source}
        onToggleTheme={toggleTheme}
        onNewProject={handleNewProject}
        onGoToLanding={() => setView('landing')}
      />

      <div className="bench">
        <ToolRail
          active={active}
          source={source}
          settings={settings}
          grid={grid}
          paletteSize={processed?.palette.length ?? 0}
          onOpen={open}
        />

        <Workspace
          source={source}
          processed={processed}
          grid={grid}
          settings={settings}
          finalSize={finalSize}
          busy={converter.busy}
          canUndo={converter.canUndo}
          onBeginStroke={converter.beginStroke}
          onPaint={converter.paint}
          onPickPixel={converter.pick}
          onUndo={converter.undo}
          active={active}
          visited={visited}
          paletteSize={processed?.palette.length ?? 0}
          onOpen={open}
          onPick={pickFile}
          onLoadSample={() => void handleLoadSample()}
        />

        <Inspector
          active={active}
          source={source}
          settings={settings}
          grid={grid}
          pixelSize={converter.pixelSize}
          processed={processed}
          finalSize={finalSize}
          error={converter.error}
          busy={converter.busy}
          onUpdate={converter.updateSettings}
          onPreset={converter.setPreset}
          onPixelSize={converter.setPixelSize}
          onGridDimension={converter.setGridDimension}
          onGridAspectLocked={converter.setGridAspectLocked}
          onOutputDimension={converter.setOutputDimension}
          onOutputAuto={converter.setOutputAuto}
          onPick={pickFile}
          onRemove={converter.clearImage}
          original={converter.original}
          transform={converter.transform}
          onRotate={converter.rotateSource}
          onCrop={converter.setCrop}
          onResetTransform={converter.resetTransform}
          onDismissError={converter.dismissError}
          onResetStage={handleResetStage}
          onChart={() => void handleChart()}
        />
      </div>

      <ExportTicket
        settings={settings}
        finalSize={finalSize}
        processed={processed}
        downloading={downloading}
        savedAt={savedAt}
        disabledReason={disabledReason}
        onUpdate={converter.updateSettings}
        onDownload={handleDownload}
      />

      <input
        ref={fileInputRef}
        className="visually-hidden"
        type="file"
        multiple
        accept={ACCEPT_ATTRIBUTE}
        aria-label="Choose an image file to convert"
        aria-invalid={converter.error ? true : undefined}
        aria-describedby={converter.error ? 'upload-error' : undefined}
        onChange={(event) => {
          void handleFiles(event.target.files);
          event.target.value = '';
        }}
      />

      {dragging ? (
        <div className="drop-overlay" aria-hidden="true">
          <div className="drop-card">
            <UploadIcon size={28} />
            <strong>Drop it on the page</strong>
            <span>PNG, JPG or WEBP · up to 30 MB</span>
          </div>
        </div>
      ) : null}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
