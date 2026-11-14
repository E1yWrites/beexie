import { describe, expect, it } from 'vitest';
import { MAX_FILE_BYTES } from '../constants';
import { validateFile } from './validation';

const base = { name: 'photo.png', type: 'image/png', size: 1024 };

describe('validateFile', () => {
  it('accepts every supported MIME type', () => {
    expect(validateFile(base).ok).toBe(true);
    expect(validateFile({ name: 'photo.jpg', type: 'image/jpeg', size: 1024 }).ok).toBe(true);
    expect(validateFile({ name: 'photo.webp', type: 'image/webp', size: 1024 }).ok).toBe(true);
  });

  it('accepts files with an empty MIME type when the extension is supported', () => {
    expect(validateFile({ name: 'clip.JPG', type: '', size: 1024 }).ok).toBe(true);
    expect(validateFile({ name: 'pasted', type: '', size: 1024 }).ok).toBe(false);
  });

  it('rejects unsupported files even when the extension looks valid', () => {
    const result = validateFile({ name: 'fake.png', type: 'text/plain', size: 10 });
    expect(result.ok).toBe(false);
  });

  it('rejects GIF files', () => {
    const result = validateFile({ name: 'anim.gif', type: 'image/gif', size: 10 });
    expect(result.ok).toBe(false);
  });

  it('rejects empty and oversized files', () => {
    expect(validateFile({ ...base, size: 0 }).ok).toBe(false);
    expect(validateFile({ ...base, size: MAX_FILE_BYTES + 1 }).ok).toBe(false);
  });
});
