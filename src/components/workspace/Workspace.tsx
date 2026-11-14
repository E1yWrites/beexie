import { useEffect, useState } from 'react';
import { useElementSize } from '../../hooks/useElementSize';
import { clamp } from '../../lib/dimensions';
import type { EditTool } from '../../lib/edits';
import { parseHexColor, rgbToHex } from '../../lib/colors';
import type {
  ConverterSettings,
  ExportSize,
  GridSize,
  PreviewMode,
  ProcessedImage,
  Rgb,
  SourceImage,
  Stage,
} from '../../types';
import { EmptyBench } from './EmptyBench';
import { ProofFrame } from './ProofFrame';
import { StageBar } from './StageBar';
import { StatusBoard } from './StatusBoard';

interface WorkspaceProps {
  source: SourceImage | null;
  processed: ProcessedImage | null;
  grid: GridSize;
  settings: ConverterSettings;
  finalSize: ExportSize;
  busy: boolean;
  active: Stage;
  visited: ReadonlySet<Stage>;
  paletteSize: number;
  onOpen: (stage: Stage) => void;
  onPick: () => void;
  onLoadSample?: () => void;
  canUndo: boolean;
  onBeginStroke: () => void;
  onPaint: (x: number, y: number, color: Rgb | null) => void;
  onPickPixel: (x: number, y: number) => Rgb | null;
  onUndo: () => void;
}

export function Workspace({
  source,
  processed,
  grid,
  settings,
  finalSize,
  busy,
  paletteSize,
  onPick,
  onLoadSample,
  canUndo,
  onBeginStroke,
  onPaint,
  onPickPixel,
  onUndo,
}: WorkspaceProps) {
  const [tool, setTool] = useState<EditTool>('off');
  const [color, setColor] = useState('#eb4a2d');
  const [mode, setMode] = useState<PreviewMode>('pixel');
  const [zoom, setZoom] = useState(100);
  const [autoFit, setAutoFit] = useState(true);
  const [compare, setCompare] = useState(50);
  const { ref, size } = useElementSize<HTMLDivElement>();

  useEffect(() => {
    setAutoFit(true);
    setZoom(100);
    setCompare(50);
    setMode('pixel');
    setTool('off');
  }, [source]);

  const editing = tool !== 'off' && mode === 'pixel' && Boolean(processed);

  const handleEdit = (fx: number, fy: number, start: boolean) => {
    if (!processed) return;
    const x = Math.floor(fx * processed.width);
    const y = Math.floor(fy * processed.height);
    if (tool === 'picker') {
      const picked = onPickPixel(x, y);
      if (picked) setColor(rgbToHex(picked));
      return;
    }
    if (start) onBeginStroke();
    onPaint(x, y, tool === 'eraser' ? null : (parseHexColor(color) ?? { r: 0, g: 0, b: 0 }));
  };

  const outputWidth = Math.max(1, settings.outputWidth);
  const outputHeight = Math.max(1, settings.outputHeight);
  const fitScale =
    size.width > 0 && size.height > 0
      ? Math.max(0.02, Math.min((size.width - 72) / outputWidth, (size.height - 72) / outputHeight, 8))
      : 1;
  const scale = autoFit ? fitScale : zoom / 100;
  const displayWidth = Math.max(1, Math.round(outputWidth * scale));
  const displayHeight = Math.max(1, Math.round(outputHeight * scale));
  const zoomPercent = Math.max(1, Math.round((autoFit ? fitScale : zoom / 100) * 100));

  const applyZoom = (percent: number) => {
    setAutoFit(false);
    setZoom(Math.round(clamp(percent, 10, 3200)));
  };

  const zoomStep = (delta: number) => {
    const base = autoFit ? fitScale * 100 : zoom;
    applyZoom(base + delta);
  };

  return (
    <main className="workspace" aria-label="Preview workspace">
      <StageBar
        mode={mode}
        disabled={!source}
        zoomPercent={zoomPercent}
        autoFit={autoFit}
        onMode={setMode}
        onZoomStep={zoomStep}
        onZoomReset={() => applyZoom(100)}
        onFit={() => setAutoFit(true)}
        tool={tool}
        color={color}
        canUndo={canUndo}
        onTool={setTool}
        onColor={(value) => {
          setColor(value);
          if (tool === 'eraser' || tool === 'off') setTool('pencil');
        }}
        onUndo={onUndo}
      />

      <div className="stage" ref={ref}>
        {source ? (
          <div className="stage-inner">
            <div className="proof-sheet" data-spotlight="">
              <ProofFrame
                source={source}
                processed={processed}
                grid={grid}
                settings={settings}
                mode={mode}
                compare={compare}
                displayWidth={displayWidth}
                displayHeight={displayHeight}
                busy={busy}
                editing={editing}
                onCompare={setCompare}
                onEdit={handleEdit}
              />
            </div>
          </div>
        ) : (
          <EmptyBench busy={busy} onPick={onPick} onLoadSample={onLoadSample} />
        )}
      </div>

      <StatusBoard
        busy={busy}
        hasImage={Boolean(source)}
        grid={grid}
        finalSize={finalSize}
        paletteSize={paletteSize}
      />
    </main>
  );
}
