import { describe, it, expect } from 'vitest';
import { isValidWhatsappInvite } from '@/lib/whatsapp/validate-url';

describe('isValidWhatsappInvite', () => {
  it('accepts a chat.whatsapp.com invite', () => {
    expect(isValidWhatsappInvite('https://chat.whatsapp.com/AbCd1234')).toBe(true);
  });

  it('accepts an invite with tracking params', () => {
    expect(isValidWhatsappInvite('https://chat.whatsapp.com/AbCd1234?s=cl&p=a')).toBe(true);
  });

  it('accepts a wa.me link', () => {
    expect(isValidWhatsappInvite('https://wa.me/33612345678')).toBe(true);
  });

  it('rejects http (non-https)', () => {
    expect(isValidWhatsappInvite('http://chat.whatsapp.com/AbCd1234')).toBe(false);
  });

  it('rejects a phishing domain', () => {
    expect(isValidWhatsappInvite('https://evil.com/chat.whatsapp.com')).toBe(false);
  });

  it('rejects empty and null', () => {
    expect(isValidWhatsappInvite('')).toBe(false);
    expect(isValidWhatsappInvite(null)).toBe(false);
    expect(isValidWhatsappInvite(undefined)).toBe(false);
  });
});
