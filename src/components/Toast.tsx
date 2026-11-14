import { CheckIcon, CloseIcon } from './icons';

export type ToastTone = 'info' | 'success' | 'error';

export interface ToastData {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  if (!toast) return null;
  return (
    <div className={`toast toast-${toast.tone}`} role={toast.tone === 'error' ? 'alert' : 'status'}>
      <span className="toast-icon" aria-hidden="true">
        {toast.tone === 'error' ? '!' : <CheckIcon size={10} />}
      </span>
      <span className="toast-message">{toast.message}</span>
      <button type="button" className="toast-close" onClick={onDismiss} aria-label="Dismiss notification">
        <CloseIcon size={13} />
      </button>
    </div>
  );
}
