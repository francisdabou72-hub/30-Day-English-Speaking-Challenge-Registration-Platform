import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isValidWhatsappInvite } from '@/lib/whatsapp/validate-url';

export async function POST(req: NextRequest) {
  const sb = await createAdminClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, message: 'Non authentifié.' }, { status: 401 });

  const { data: isAdmin } = await sb
    .from('challenge_admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (!isAdmin) return NextResponse.json({ ok: false, message: 'Accès refusé.' }, { status: 403 });

  let body: { id?: string; whatsapp_invite_url?: string | null; is_open?: boolean };
  try { body = await req.json(); }
  catch { return NextResponse.json({ ok: false, message: 'Corps invalide.' }, { status: 400 }); }

  const { id, whatsapp_invite_url, is_open } = body;
  if (!id) return NextResponse.json({ ok: false, message: 'Identifiant manquant.' }, { status: 400 });

  if (whatsapp_invite_url != null && whatsapp_invite_url !== '') {
    if (!isValidWhatsappInvite(whatsapp_invite_url)) {
      return NextResponse.json(
        { ok: false, message: 'Lien WhatsApp invalide. Format attendu : https://chat.whatsapp.com/…' },
        { status: 400 }
      );
    }
  }

  const { error } = await sb
    .from('challenge_departments')
    .update({
      whatsapp_invite_url: whatsapp_invite_url || null,
      is_open: Boolean(is_open),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ ok: false, message: 'Erreur serveur.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
