'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type State = 'checking' | 'allowed' | 'denied' | 'no-session';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<State>('checking');

  useEffect(() => {
    (async () => {
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) {
        router.replace('/admin/login');
        setState('no-session');
        return;
      }
      const { data: allow } = await sb
        .from('challenge_admins')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();
      setState(allow ? 'allowed' : 'denied');
    })();
  }, [router]);

  if (state === 'checking') {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-xom-muted text-[14px]">Vérification de l&apos;accès…</div>
      </div>
    );
  }

  if (state === 'no-session') return null;

  if (state === 'denied') {
    return (
      <div className="min-h-dvh flex items-center justify-center px-6">
        <div className="glass-card rounded-[24px] p-8 max-w-md text-center">
          <h1 className="display text-[24px] text-xom-ink">Accès refusé</h1>
          <p className="mt-3 text-[14px] text-xom-muted">
            Ton compte est connecté mais n&apos;est pas autorisé à accéder au tableau de bord.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
