'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { RegistrationSchema } from '@/lib/validation/schemas';
import { normalizePhone } from '@/lib/phone/normalize';
import type { DepartmentId } from '@/lib/departments';
import { PhoneField } from './PhoneField';
import { DepartmentCards } from './DepartmentCards';

type FieldErrors = Partial<Record<'first_name'|'last_name'|'whatsapp'|'email'|'department', string>>;

const labelCls = 'block text-[13.5px] font-medium text-xom-ink/85 mb-2';
const fieldCls =
  'w-full rounded-[12px] border border-xom-indigo-700/15 bg-white/75 px-4 py-3 text-[15px] outline-none focus-gold placeholder:text-xom-muted/45 transition-all duration-200 hover:border-xom-indigo-700/25';

export function RegistrationForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState<DepartmentId | ''>('');
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    const normalizedPhone = normalizePhone(phone, 'FR') ?? '';
    const parsed = RegistrationSchema.safeParse({
      first_name: firstName, last_name: lastName,
      whatsapp_e164: normalizedPhone, email: email ?? '',
      department: department || undefined, website: honeypot,
    });
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const p = issue.path[0];
        if (p === 'first_name') next.first_name = 'Prénom requis';
        else if (p === 'last_name') next.last_name = 'Nom requis';
        else if (p === 'whatsapp_e164') next.whatsapp = 'Numéro WhatsApp invalide';
        else if (p === 'email') next.email = 'Adresse e-mail invalide';
        else if (p === 'department') next.department = 'Choisis un domaine';
      }
      setErrors(next); return;
    }
    setErrors({}); setSubmitting(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(typeof data?.message === 'string' ? data.message : 'Une erreur est survenue.');
        setSubmitting(false); return;
      }
      const params = new URLSearchParams({
        dept: data.department as string,
        url: data.whatsapp_invite_url as string,
        id: data.registration_id as string,
      });
      router.push(`/merci?${params.toString()}`);
    } catch {
      toast.error('Connexion instable. Vérifie ta connexion et réessaie.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass-card rounded-[28px] p-7 sm:p-10">
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="first_name" className={labelCls}>Prénom</label>
            <input id="first_name" name="first_name" type="text" autoComplete="given-name"
              required maxLength={80} value={firstName}
              onChange={(e) => setFirstName(e.target.value)} className={fieldCls} />
            {errors.first_name ? <p className="mt-2 text-[13px] text-red-600">{errors.first_name}</p> : null}
          </div>
          <div>
            <label htmlFor="last_name" className={labelCls}>Nom</label>
            <input id="last_name" name="last_name" type="text" autoComplete="family-name"
              required maxLength={80} value={lastName}
              onChange={(e) => setLastName(e.target.value)} className={fieldCls} />
            {errors.last_name ? <p className="mt-2 text-[13px] text-red-600">{errors.last_name}</p> : null}
          </div>
        </div>

        <div>
          <label htmlFor="whatsapp" className={labelCls}>Numéro WhatsApp</label>
          <PhoneField value={phone} onChange={setPhone} error={errors.whatsapp} />
          <p className="mt-2 text-[12.5px] text-xom-muted/85">
            Utilisé uniquement pour t&apos;ajouter à ton groupe WhatsApp.
          </p>
        </div>

        <div>
          <label htmlFor="email" className={labelCls}>
            E-mail <span className="text-xom-muted/60 font-normal">(optionnel)</span>
          </label>
          <input id="email" name="email" type="email" autoComplete="email" maxLength={254}
            value={email} onChange={(e) => setEmail(e.target.value)} className={fieldCls} />
          {errors.email ? <p className="mt-2 text-[13px] text-red-600">{errors.email}</p> : null}
        </div>

        <DepartmentCards value={department} onChange={setDepartment} error={errors.department} />

        <input type="text" tabIndex={-1} autoComplete="off"
          value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
          className="hidden" aria-hidden />

        <button type="submit" disabled={submitting}
          className="w-full rounded-[14px] bg-linear-to-b from-xom-indigo-500 to-xom-indigo-700 text-white font-medium py-3.5 text-[15px] tracking-wide focus-gold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:from-xom-indigo-400 hover:to-xom-indigo-500 shadow-[0_14px_34px_-12px_rgba(46,26,107,0.55)] hover:shadow-[0_18px_40px_-14px_rgba(46,26,107,0.65)] active:scale-[0.995]">
          {submitting ? 'Envoi en cours…' : 'Valider mon inscription'}
        </button>

      </div>
    </form>
  );
}
