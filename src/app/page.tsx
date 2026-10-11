import { Logo } from '@/components/brand/Logo';
import { RegistrationForm } from '@/components/form/RegistrationForm';

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="glass-header sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-center">
          <Logo size={56} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 sm:px-6 pt-14 sm:pt-20 pb-20">
        <section className="text-center animate-in fade-in slide-in-from-bottom-2 duration-700">
          <h1 className="display text-[38px] sm:text-[56px] leading-[1.04] text-xom-ink tracking-[-0.022em]">
            30 jours pour oser
            <br />
            <span className="text-xom-indigo-700">parler anglais.</span>
          </h1>
          <p className="mt-7 text-[15.5px] sm:text-[17px] leading-[1.65] text-xom-muted max-w-xl mx-auto">
            Pratique l&apos;anglais autour de tes objectifs : technologie, affaires, santé, voyages,
            études ou conversations du quotidien. Rejoins une communauté qui t&apos;aide à pratiquer avec régularité.
          </p>
        </section>

        <section className="mt-12 sm:mt-16 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150 fill-mode-both">
          <RegistrationForm />
        </section>

        <p className="mt-8 text-center text-[12.5px] text-xom-muted/75">
          En validant ton inscription, tu rejoins ton groupe WhatsApp pour participer au défi.
        </p>
      </main>

      <footer className="mt-auto pb-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-xom-muted/70">
            Powered by <span className="text-xom-indigo-700 font-medium tracking-[0.2em]">Xom</span> — Vivez l&apos;anglais
          </p>
          <p className="mt-3 text-[11px] text-xom-muted/60 tracking-wider">
            All rights reserved. 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
