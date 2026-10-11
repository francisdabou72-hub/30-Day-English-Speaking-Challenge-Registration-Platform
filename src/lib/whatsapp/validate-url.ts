const ALLOWED = [
  /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+(\?[A-Za-z0-9_=&%-]*)?$/,
  /^https:\/\/wa\.me\/[0-9]+(\?[A-Za-z0-9_=&%-]*)?$/,
];

export function isValidWhatsappInvite(url: string | null | undefined): boolean {
  if (!url) return false;
  return ALLOWED.some((r) => r.test(url));
}

export function assertWhatsappInvite(url: string): void {
  if (!isValidWhatsappInvite(url)) {
    throw new Error('Invalid WhatsApp invite URL');
  }
}
