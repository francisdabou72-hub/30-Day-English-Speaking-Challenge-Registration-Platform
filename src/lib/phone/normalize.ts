import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';

export function normalizePhone(input: string, defaultCountry?: CountryCode): string | null {
  const parsed = parsePhoneNumberFromString(input, defaultCountry);
  if (!parsed || !parsed.isValid()) return null;
  return parsed.number; // E.164
}

export function formatPhoneE164(input: string, defaultCountry?: CountryCode): string {
  return normalizePhone(input, defaultCountry) ?? input;
}
