'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { DEPARTMENTS, type DepartmentId } from '@/lib/departments';
import { Logo } from '@/components/brand/Logo';

function SuccessContent() {
  const params = useSearchParams();
  const dept = (params.get('dept') ?? '') as DepartmentId;
  const url = params.get('url') ?? '';
  const meta = DEPARTMENTS.find((d) => d.id === dept);

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="glass-header">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3"><Logo /></div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-2xl px-4 sm:px-6 py-12">
        <div className="glass-card rounded-[24px] p-7 sm:p-10 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-xom-gold-500/15 flex items-center justify-center">
            <span className="block w-3 h-3 rounded-full bg-xom-gold-500" aria-hidden />
          </div>
          <h1 className="display mt-5 text-[30px] sm:text-[38px] leading-tight text-xom-ink">
            Inscription confirmée.
          </h1>
          <p className="mt-3 text-[15px] text-xom-muted">
            Bravo&nbsp;! Ton inscription au défi 30 jours est bien enregistrée.
          </p>

          {meta ? (
            <div className="mt-6 rounded-[14px] border border-xom-indigo-700/15 bg-white/70 px-4 py-3 text-left">
              <div className="text-[11px] uppercase tracking-[0.2em] text-xom-muted">Ton domaine</div>
              <div className="mt-1 font-medium text-xom-ink">
                {meta.nameEn} <span aria-hidden>🇺🇸</span>
                <span className="text-xom-muted text-sm font-normal"> — {meta.nameFr} <span aria-hidden>🇫🇷</span></span>
              </div>
            </div>
          ) : null}

          <p className="mt-6 text-[14px] text-xom-muted leading-relaxed">
            Pour participer au défi, rejoins maintenant ton groupe WhatsApp. WhatsApp te demandera de confirmer ton entrée.
          </p>

          {url ? (
            <div className="mt-6 flex flex-col gap-2">
              <a href={url} target="_blank" rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center rounded-[12px] bg-linear-to-b from-xom-indigo-500 to-xom-indigo-700 text-white font-medium py-3 text-[15px] focus-gold transition-all duration-300 hover:from-xom-indigo-400 hover:to-xom-indigo-500 shadow-[0_10px_30px_-10px_rgba(46,26,107,0.55)]">
                Rejoindre mon groupe WhatsApp
              </a>
              <a href={url} target="_blank" rel="noopener noreferrer"
                className="text-[13px] text-xom-muted underline underline-offset-4">
                Lien bloqué&nbsp;? Ouvre-le manuellement
              </a>
            </div>
          ) : (
            <p className="mt-6 text-sm text-red-600">
              Le lien WhatsApp n&apos;est pas disponible. Contacte l&apos;organisateur.
            </p>
          )}

          <Link href="/" className="mt-8 inline-block text-[13px] text-xom-muted hover:text-xom-ink transition">
            Retour à l&apos;accueil
          </Link>
        </div>

        <p className="mt-8 text-center text-[11px] uppercase tracking-[0.22em] text-xom-muted/80">
          Powered by <span className="text-xom-indigo-700 font-medium">Xom</span> — Vivez l&apos;anglais
        </p>
        <p className="mt-2 text-center text-[11px] text-xom-muted/70">All rights reserved. 2026</p>
      </main>
    </div>
  );
}

export default function MerciPage() {
  return <Suspense fallback={<div className="min-h-dvh" />}><SuccessContent /></Suspense>;
}
