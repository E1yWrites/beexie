import { ACCEPTED_EXTENSIONS, ACCEPTED_MIME_TYPES, MAX_FILE_BYTES, MIN_FILE_BYTES } from '../constants';

export type FileValidation = { ok: true } | { ok: false; error: string };

function extensionOf(name: string): string {
  const index = name.lastIndexOf('.');
  return index === -1 ? '' : name.slice(index + 1).toLowerCase();
}

export function validateFile(file: { name: string; type: string; size: number }): FileValidation {
  const extension = extensionOf(file.name);
  const mimeAccepted = (ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type);
  const extensionAccepted = (ACCEPTED_EXTENSIONS as readonly string[]).includes(extension);

  if (file.type) {
    if (!mimeAccepted) {
      return { ok: false, error: 'Unsupported file type. Use a PNG, JPG or WEBP image.' };
    }
  } else if (!extensionAccepted) {
    return { ok: false, error: 'Unsupported file type. Use a PNG, JPG or WEBP image.' };
  }

  if (file.size < MIN_FILE_BYTES) {
    return { ok: false, error: 'That file is empty or unreadable.' };
  }

  if (file.size > MAX_FILE_BYTES) {
    const limit = Math.round(MAX_FILE_BYTES / (1024 * 1024));
    return { ok: false, error: `That image is too large. The limit is ${limit} MB.` };
  }

  return { ok: true };
}
