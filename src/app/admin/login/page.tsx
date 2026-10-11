'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const sb = createClient();
    const { error: signInError } = await sb.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError('Identifiants invalides.');
      setLoading(false);
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-12">
      <form onSubmit={onSubmit} className="glass-card rounded-[24px] p-8 w-full max-w-sm">
        <h1 className="display text-[26px] leading-tight text-xom-ink text-center">
          Accès administrateur
        </h1>
        <p className="mt-2 text-[13px] text-xom-muted text-center">
          Réservé à l&apos;organisateur du défi.
        </p>

        <div className="mt-7 space-y-4">
          <div>
            <label htmlFor="email" className="block text-[13.5px] font-medium text-xom-ink/85 mb-2">
              Adresse e-mail
            </label>
            <input id="email" type="email" autoComplete="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[12px] border border-xom-indigo-700/15 bg-white/75 px-4 py-3 text-[15px] outline-none focus-gold" />
          </div>
          <div>
            <label htmlFor="password" className="block text-[13.5px] font-medium text-xom-ink/85 mb-2">
              Mot de passe
            </label>
            <input id="password" type="password" autoComplete="current-password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[12px] border border-xom-indigo-700/15 bg-white/75 px-4 py-3 text-[15px] outline-none focus-gold" />
          </div>

          {error ? <p className="text-[13px] text-red-600 text-center">{error}</p> : null}

          <button type="submit" disabled={loading}
            className="w-full rounded-[14px] bg-linear-to-b from-xom-indigo-500 to-xom-indigo-700 text-white font-medium py-3.5 text-[15px] focus-gold transition-all duration-300 disabled:opacity-60 hover:from-xom-indigo-400 hover:to-xom-indigo-500 shadow-[0_14px_34px_-12px_rgba(46,26,107,0.55)]">
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>

          <p className="text-[11px] text-xom-muted/70 text-center pt-2">
            Powered by <span className="text-xom-indigo-700 font-medium">Xom</span> — Vivez l&apos;anglais
          </p>
        </div>
      </form>
    </div>
  );
}
