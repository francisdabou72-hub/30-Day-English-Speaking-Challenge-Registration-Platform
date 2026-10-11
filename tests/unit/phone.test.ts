import { describe, it, expect } from 'vitest';
import { normalizePhone } from '@/lib/phone/normalize';

describe('normalizePhone', () => {
  it('normalizes FR local number with default country', () => {
    expect(normalizePhone('06 12 34 56 78', 'FR')).toBe('+33612345678');
  });

  it('normalizes international format', () => {
    expect(normalizePhone('+33 6 12 34 56 78')).toBe('+33612345678');
  });

  it('normalizes US number', () => {
    expect(normalizePhone('+1 415 555 0123')).toBe('+14155550123');
  });

  it('returns null for garbage', () => {
    expect(normalizePhone('abc')).toBe(null);
  });

  it('returns null for too-short number', () => {
    expect(normalizePhone('+33 6', 'FR')).toBe(null);
  });
});
