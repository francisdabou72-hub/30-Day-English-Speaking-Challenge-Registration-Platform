import 'server-only';
import { createClient as createSbClient } from '@supabase/supabase-js';

/**
 * Service-role client. NEVER import this from a client component.
 * The `server-only` import above enforces that at build time.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase server env vars');
  return createSbClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
