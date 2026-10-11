import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const sb = await createAdminClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const { data: isAdmin } = await sb
    .from('challenge_admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (!isAdmin) return new NextResponse('Forbidden', { status: 403 });

  const { data, error } = await sb
    .from('challenge_registrations')
    .select('first_name,last_name,whatsapp_e164,email_normalized,department,status,created_at')
    .order('created_at', { ascending: false });

  if (error) return new NextResponse('Server error', { status: 500 });

  const headers = ['first_name','last_name','whatsapp_e164','email_normalized','department','status','created_at'];
  const escape = (v: unknown) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv =
    headers.join(',') + '\n' +
    (data ?? []).map((row) => headers.map((h) => escape((row as Record<string, unknown>)[h])).join(',')).join('\n');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="xom-registrations-${new Date().toISOString().slice(0,10)}.csv"`,
    },
  });
}
