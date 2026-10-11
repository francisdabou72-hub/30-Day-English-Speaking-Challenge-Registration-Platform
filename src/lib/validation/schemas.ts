import { z } from 'zod';

export const DOMAIN_IDS = ['tech','business','health','travel','academic','general'] as const;
export type DomainId = (typeof DOMAIN_IDS)[number];

export const RegistrationSchema = z.object({
  first_name: z.string().trim().min(1, 'Prenom requis').max(80),
  last_name:  z.string().trim().min(1, 'Nom requis').max(80),
  whatsapp_e164: z.string().regex(/^\+[1-9][0-9]{6,14}$/, 'Numero WhatsApp invalide'),
  email: z.union([
    z.literal(''),
    z.string().trim().email('Adresse e-mail invalide').max(254),
  ]).optional().default(''),
  department: z.enum(DOMAIN_IDS),
  // Honeypot — must be empty
  website: z.string().max(0).optional().default(''),
});

export type RegistrationInput = z.infer<typeof RegistrationSchema>;
