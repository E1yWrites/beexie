import { useEffect, useRef } from 'react';
import { SHORTCUTS } from '../../lib/shortcuts';
import { CloseIcon } from '../icons';
import { Toggle } from '../ui/Toggle';

interface ShortcutsDialogProps {
  open: boolean;
  enabled: boolean;
  onEnabled: (enabled: boolean) => void;
  onClose: () => void;
}

const keyName = (key: string) => (key.length === 1 && /[a-z]/.test(key) ? key.toUpperCase() : key);

/** Native modal dialog: the browser traps focus, makes the page inert and closes on Escape. */
export function ShortcutsDialog({ open, enabled, onEnabled, onClose }: ShortcutsDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="keys-dialog"
      aria-labelledby="keys-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="keys-head">
        <h2 id="keys-title">Keyboard shortcuts</h2>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close keyboard shortcuts">
          <CloseIcon size={16} />
        </button>
      </div>
      <table className="keys-table">
        <tbody>
          {SHORTCUTS.map((shortcut) => (
            <tr key={shortcut.label}>
              <td>
                {shortcut.keys.map((key, index) => (
                  <span key={key}>
                    {index > 0 ? ' or ' : null}
                    <kbd>{keyName(key)}</kbd>
                  </span>
                ))}
              </td>
              <td>{shortcut.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Toggle
        label="Single-key shortcuts"
        description="Turn off if keys clash with a screen reader or voice control."
        checked={enabled}
        onChange={onEnabled}
      />
      <p className="panel-note">Shortcuts pause while you type in a field.</p>
    </dialog>
  );
}
