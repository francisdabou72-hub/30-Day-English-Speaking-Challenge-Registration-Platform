import { describe, it, expect } from 'vitest';
import { RegistrationSchema } from '@/lib/validation/schemas';

const base = {
  first_name: 'Marie',
  last_name: 'Dupont',
  whatsapp_e164: '+33612345678',
  department: 'tech' as const,
  email: '',
  website: '',
};

describe('RegistrationSchema', () => {
  it('accepts a minimal valid payload without email', () => {
    expect(RegistrationSchema.safeParse(base).success).toBe(true);
  });

  it('accepts a valid payload with email', () => {
    expect(RegistrationSchema.safeParse({ ...base, email: 'a@b.co' }).success).toBe(true);
  });

  it('rejects empty first name', () => {
    expect(RegistrationSchema.safeParse({ ...base, first_name: '' }).success).toBe(false);
  });

  it('rejects whitespace-only last name', () => {
    expect(RegistrationSchema.safeParse({ ...base, last_name: '   ' }).success).toBe(false);
  });

  it('rejects invalid phone', () => {
    expect(RegistrationSchema.safeParse({ ...base, whatsapp_e164: '0612345678' }).success).toBe(false);
  });

  it('rejects invalid email when provided', () => {
    expect(RegistrationSchema.safeParse({ ...base, email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects unknown department', () => {
    expect(RegistrationSchema.safeParse({ ...base, department: 'music' as never }).success).toBe(false);
  });

  it('rejects filled honeypot', () => {
    expect(RegistrationSchema.safeParse({ ...base, website: 'spam' }).success).toBe(false);
  });

  it('trims first name', () => {
    const r = RegistrationSchema.safeParse({ ...base, first_name: '  Marie  ' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.first_name).toBe('Marie');
  });
});
