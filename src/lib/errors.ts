export const ErrorCode = {
  INVALID_INPUT: 'INVALID_INPUT',
  DUPLICATE: 'DUPLICATE',
  DEPARTMENT_CLOSED: 'DEPARTMENT_CLOSED',
  DEPARTMENT_UNAVAILABLE: 'DEPARTMENT_UNAVAILABLE',
  UNKNOWN_DEPARTMENT: 'UNKNOWN_DEPARTMENT',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

export type ErrorCodeT = (typeof ErrorCode)[keyof typeof ErrorCode];

const MESSAGES: Record<ErrorCodeT, string> = {
  INVALID_INPUT: 'Veuillez verifier les informations saisies.',
  DUPLICATE: 'Cette inscription existe deja. Utilisez le meme numero WhatsApp ou e-mail.',
  DEPARTMENT_CLOSED: 'Les inscriptions pour ce domaine sont actuellement fermees.',
  DEPARTMENT_UNAVAILABLE: 'Ce domaine sera bientot disponible. Merci de votre patience.',
  UNKNOWN_DEPARTMENT: 'Domaine inconnu.',
  RATE_LIMITED: 'Trop de tentatives. Merci de reessayer dans quelques minutes.',
  SERVER_ERROR: 'Une erreur est survenue. Merci de reessayer.',
};

export function frenchMessage(code: ErrorCodeT): string {
  return MESSAGES[code];
}

export class AppError extends Error {
  constructor(public code: ErrorCodeT, message?: string) {
    super(message ?? MESSAGES[code]);
  }
}
