import { NextRequest, NextResponse } from 'next/server';
import { RegistrationSchema } from '@/lib/validation/schemas';
import { createServiceClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';
import { ErrorCode, frenchMessage, type ErrorCodeT } from '@/lib/errors';


function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function fail(code: ErrorCodeT, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json(
    { ok: false, code, message: frenchMessage(code), ...extra },
    { status }
  );
}

export async function POST(req: NextRequest) {
  // 1. Rate limit
  const ip = clientIp(req);
  const rl = rateLimit(`register:${ip}`);
  if (!rl.ok) {
    return fail(ErrorCode.RATE_LIMITED, 429, { retryAfterSec: rl.retryAfterSec });
  }

  // 2. Parse JSON
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail(ErrorCode.INVALID_INPUT, 400);
  }

  // 3. Validate
  const parsed = RegistrationSchema.safeParse(body);
  if (!parsed.success) {
    return fail(ErrorCode.INVALID_INPUT, 400);
  }
  const input = parsed.data;

  // 4. Honeypot
  if (input.website && input.website.length > 0) {
    return fail(ErrorCode.INVALID_INPUT, 400);
  }

  // 5. Call atomic RPC
  try {
    const sb = createServiceClient();
    const { data, error } = await sb.rpc('register_for_challenge', {
      p_first_name: input.first_name,
      p_last_name:  input.last_name,
      p_whatsapp:   input.whatsapp_e164,
      p_email:      input.email ?? '',
      p_department: input.department,
    });

    if (error) {
      console.error('[register] rpc error', { code: error.code });
      return fail(ErrorCode.SERVER_ERROR, 500);
    }

    const result = data as { ok: boolean; code?: string; whatsapp_invite_url?: string; department?: string; registration_id?: string };

    if (!result.ok) {
      switch (result.code) {
        case 'duplicate':             return fail(ErrorCode.DUPLICATE, 409);
        case 'department_closed':     return fail(ErrorCode.DEPARTMENT_CLOSED, 409);
        case 'department_unavailable':return fail(ErrorCode.DEPARTMENT_UNAVAILABLE, 409);
        case 'unknown_department':    return fail(ErrorCode.UNKNOWN_DEPARTMENT, 400);
        default:                      return fail(ErrorCode.SERVER_ERROR, 500);
      }
    }

    return NextResponse.json({
      ok: true,
      registration_id: result.registration_id,
      department: result.department,
      whatsapp_invite_url: result.whatsapp_invite_url,
    });
  } catch (err) {
    console.error('[register] unexpected', err instanceof Error ? err.message : 'unknown');
    return fail(ErrorCode.SERVER_ERROR, 500);
  }
}
