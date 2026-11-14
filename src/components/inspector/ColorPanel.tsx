import { useEffect, useMemo, useState } from 'react';
import { MAX_CUSTOM_COLORS, PALETTE_PRESETS, QUANTIZATION_LEVELS, RETRO_PRESETS } from '../../constants';
import { saveBlob } from '../../lib/export';
import { normalizeSlug, PaletteError, parseLospec, parsePaletteFile, toGpl, toHex } from '../../lib/paletteFiles';
import type { ColorMode, ConverterSettings, DitherMode, RetroPresetId } from '../../types';
import { Segmented } from '../ui/Segmented';
import { Slider } from '../ui/Slider';
import { Toggle } from '../ui/Toggle';
import { PaletteComb } from './PaletteComb';

interface ColorPanelProps {
  settings: ConverterSettings;
  palette: string[];
  disabled: boolean;
  onUpdate: (patch: Partial<ConverterSettings>) => void;
}

const MODES: { value: ColorMode; label: string; hint: string }[] = [
  { value: 'original', label: 'Orig', hint: 'Keep the source colors' },
  { value: 'reduced', label: 'Palette', hint: 'Median-cut palette from the image' },
  { value: 'grayscale', label: 'Gray', hint: 'Luminance only' },
  { value: 'monochrome', label: 'Mono', hint: 'One-bit black and white' },
  { value: 'custom', label: 'Custom', hint: 'Map to your own palette' },
];

const ADD_COLORS = ['#f0b429', '#a85f16', '#4f7a3a', '#2b4c7e', '#a8261d', '#fbf5e6', '#221a0b'];

export function ColorPanel({ settings, palette, disabled, onUpdate }: ColorPanelProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const customColors = settings.customPalette;
  const mode = settings.colorMode;

  const combColors = useMemo(() => {
    if (mode === 'custom') return customColors;
    if (mode === 'reduced') return palette;
    if (mode === 'monochrome') return ['#221a0b', '#f6edd8'];
    return [];
  }, [mode, customColors, palette]);

  useEffect(() => {
    setSelected((current) => {
      if (combColors.length === 0) return null;
      if (current === null || current >= combColors.length) return 0;
      return current;
    });
  }, [mode, combColors.length]);

  const editable = mode === 'custom';
  const [paletteError, setPaletteError] = useState<string | null>(null);
  const [slug, setSlug] = useState('');
  const [fetching, setFetching] = useState(false);

  const loadPalette = (colors: string[]) => {
    onUpdate({ colorMode: 'custom', customPalette: colors });
    setSelected(0);
    setPaletteError(null);
  };

  const importFile = async (file: File) => {
    try {
      loadPalette(parsePaletteFile(file.name, await file.text()));
    } catch (error) {
      setPaletteError(error instanceof PaletteError ? error.message : 'That palette file could not be read.');
    }
  };

  // The only network call in beexie: it sends the palette slug to lospec.com, never image data.
  const fetchLospec = async () => {
    const clean = normalizeSlug(slug);
    if (!clean) {
      setPaletteError('Use a Lospec palette slug like pico-8.');
      return;
    }
    setFetching(true);
    try {
      const response = await fetch(`https://lospec.com/palette-list/${clean}.json`, { signal: AbortSignal.timeout(10_000) });
      if (!response.ok) throw new PaletteError(`Lospec has no palette called ${clean}.`);
      loadPalette(parseLospec(await response.json()));
    } catch (error) {
      // Lospec answers unknown slugs without CORS headers, so a missing palette looks like a network error.
      setPaletteError(
        error instanceof PaletteError ? error.message : `Could not load ${clean} from Lospec. Check the name and your connection.`,
      );
    } finally {
      setFetching(false);
    }
  };

  const savePalette = (kind: 'hex' | 'gpl') => {
    const text = kind === 'hex' ? toHex(customColors) : toGpl(customColors);
    saveBlob(new Blob([text], { type: 'text/plain' }), `beexie-palette.${kind}`);
  };

  const setColor = (index: number, color: string) => {
    onUpdate({ customPalette: customColors.map((current, currentIndex) => (currentIndex === index ? color : current)) });
  };

  const addColor = () => {
    if (customColors.length >= MAX_CUSTOM_COLORS) return;
    const color = ADD_COLORS[customColors.length % ADD_COLORS.length];
    onUpdate({ colorMode: 'custom', customPalette: [...customColors, color] });
    setSelected(customColors.length);
  };

  const removeColor = (index: number) => {
    if (customColors.length <= 2) return;
    const next = customColors.filter((_, currentIndex) => currentIndex !== index);
    onUpdate({ colorMode: 'custom', customPalette: next });
    setSelected(Math.min(index, next.length - 1));
  };

  const toggleRetroPreset = (presetId: RetroPresetId) => {
    if (settings.retroPreset === presetId) {
      onUpdate({ retroPreset: null });
      return;
    }
    const preset = RETRO_PRESETS.find((item) => item.id === presetId);
    if (!preset) return;
    onUpdate({
      retroPreset: preset.id,
      colorMode: preset.settings.colorMode,
      reducedColors: preset.settings.reducedColors,
      ...(preset.settings.customPalette ? { customPalette: [...preset.settings.customPalette] } : {}),
      quantization: preset.settings.quantization,
      dithering: preset.settings.dithering,
      ditherMode: preset.settings.ditherMode,
    });
  };

  return (
    <div className="panel-body">
      <div className="panel-group">
        <div className="field-head">
          <span className="field-label">Retro style presets</span>
          {settings.retroPreset ? (
            <button
              type="button"
              className="text-btn"
              onClick={() => onUpdate({ retroPreset: null })}
            >
              Clear
            </button>
          ) : null}
        </div>
        <div className="retro-presets" role="group" aria-label="Retro style presets">
          {RETRO_PRESETS.map((preset) => {
            const active = settings.retroPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                className={`retro-preset-btn${active ? ' active' : ''}`}
                aria-pressed={active}
                disabled={disabled}
                onClick={() => toggleRetroPreset(preset.id)}
              >
                <div className="retro-preset-head">
                  <span className="retro-preset-name">{preset.name}</span>
                  <span className="retro-preset-era mono">{preset.era}</span>
                </div>
                <span className="retro-preset-desc">{preset.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="panel-group">
        <div className="field-head">
          <span className="field-label">Color mode</span>
        </div>
        <Segmented<ColorMode>
          label="Color mode"
          className="mode-seg"
          value={mode}
          onChange={(value) => onUpdate({ colorMode: value })}
          options={MODES.map((item) => ({ value: item.value, label: item.label, title: item.hint }))}
        />
      </div>

      <div className="panel-group">
        {mode === 'reduced' ? (
          <Slider
            label="Palette colors"
            value={settings.reducedColors}
            min={2}
            max={64}
            disabled={disabled}
            onChange={(value) => onUpdate({ reducedColors: value })}
            formatValue={(value) => (
              <>
                <span className="mono tnum">{value}</span> colors
              </>
            )}
            hint="Median cut over a bounded sample of the image."
          />
        ) : null}

        {combColors.length > 0 ? (
          <div className="field">
            {mode !== 'reduced' ? (
              <div className="field-head">
                <span className="field-label">Palette colors</span>
                <span className="field-value">
                  <span className="mono tnum">{combColors.length}</span> colors
                </span>
              </div>
            ) : null}
            <PaletteComb
              colors={combColors}
              editable={editable}
              selected={selected}
              onSelect={setSelected}
              onRemove={editable ? removeColor : undefined}
              onAdd={editable ? addColor : undefined}
              label={editable ? 'Custom palette' : 'Palette from the image'}
            />
            {editable && selected !== null && combColors[selected] ? (
              <div className="swatch-editor">
                <label className="swatch-color">
                  <input
                    type="color"
                    value={combColors[selected]}
                    aria-label={`Edit color ${selected + 1}`}
                    onChange={(event) => setColor(selected, event.target.value)}
                  />
                  <code>{combColors[selected].toUpperCase()}</code>
                </label>
                <button
                  type="button"
                  className="text-btn"
                  disabled={customColors.length <= 2}
                  onClick={() => removeColor(selected)}
                >
                  Remove
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="panel-note">
            {mode === 'original'
              ? 'Original keeps every source color. Choose Palette for a fixed, countable set.'
              : 'Grayscale keeps no palette; each pixel is luminance only.'}
          </p>
        )}

        {editable ? (
          <label className="select-field">
            <span>Load a palette</span>
            <select
              className="select"
              defaultValue=""
              onChange={(event) => {
                const preset = PALETTE_PRESETS.find((item) => item.id === event.target.value);
                if (preset) loadPalette([...preset.colors]);
                event.target.value = '';
              }}
            >
              <option value="">Preset palettes...</option>
              {PALETTE_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name} ({preset.colors.length})
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {editable ? (
          <div className="palette-io">
            <div className="palette-io-row">
              <label className="btn-secondary palette-file">
                Import .hex or .gpl
                <input
                  className="visually-hidden"
                  type="file"
                  accept=".hex,.gpl,text/plain"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void importFile(file);
                    event.target.value = '';
                  }}
                />
              </label>
              <button type="button" className="text-btn" onClick={() => savePalette('hex')}>
                Save .hex
              </button>
              <button type="button" className="text-btn" onClick={() => savePalette('gpl')}>
                Save .gpl
              </button>
            </div>
            <form
              className="palette-io-row"
              onSubmit={(event) => {
                event.preventDefault();
                void fetchLospec();
              }}
            >
              <label className="select-field palette-slug">
                <span>Lospec slug</span>
                <input
                  className="select"
                  type="text"
                  value={slug}
                  placeholder="pico-8"
                  spellCheck={false}
                  autoCapitalize="off"
                  onChange={(event) => setSlug(event.target.value)}
                />
              </label>
              <button type="submit" className="btn-secondary" disabled={fetching || slug.trim() === ''}>
                {fetching ? 'Fetching...' : 'Fetch'}
              </button>
            </form>
            <p className="panel-note">Fetch sends only the palette name to lospec.com. Up to {MAX_CUSTOM_COLORS} colors.</p>
            {paletteError ? (
              <p className="palette-error" role="alert">
                {paletteError}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="panel-group">
        <div className="field-head">
          <span className="field-label">Diffusion &amp; overlay</span>
        </div>

        <Toggle
          label="Dither"
          description="Mix palette tones to fake in-between colors."
          checked={settings.dithering}
          onChange={(checked) => onUpdate({ dithering: checked })}
        />

        {settings.dithering ? (
          <Segmented<DitherMode>
            label="Dither type"
            value={settings.ditherMode}
            onChange={(value) => onUpdate({ ditherMode: value })}
            options={[
              { value: 'floyd', label: 'Floyd', title: 'Error diffusion, organic' },
              { value: 'bayer', label: 'Bayer', title: 'Ordered 4x4, stable crosshatch' },
            ]}
          />
        ) : null}

        <Toggle
          label="Pixel grid overlay"
          description="Preview-only guide lines between art pixels."
          checked={settings.gridOverlay}
          onChange={(checked) => onUpdate({ gridOverlay: checked })}
        />

        <label className="select-inline">
          <span>Levels</span>
          <select
            className="select"
            value={settings.quantization}
            onChange={(event) => onUpdate({ quantization: Number(event.target.value) })}
          >
            {QUANTIZATION_LEVELS.map((levels) => (
              <option key={levels} value={levels}>
                {levels === 0 ? 'Off (full color)' : `${levels} per channel`}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
