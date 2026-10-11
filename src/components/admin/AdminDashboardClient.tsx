'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { DEPARTMENTS, type DepartmentId } from '@/lib/departments';
import { toast } from 'sonner';

type Registration = {
  id: string;
  first_name: string;
  last_name: string;
  whatsapp_e164: string;
  email_normalized: string | null;
  department: DepartmentId;
  status: 'active' | 'cancelled';
  created_at: string;
};

type DepartmentRow = {
  id: DepartmentId;
  is_open: boolean;
  whatsapp_invite_url: string | null;
};

export function AdminDashboardClient() {
  const router = useRouter();
  const [rows, setRows] = useState<Registration[]>([]);
  const [depts, setDepts] = useState<DepartmentRow[]>([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<DepartmentId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'cancelled'>('all');
  const [page, setPage] = useState(0);
  const pageSize = 25;
  const [loading, setLoading] = useState(true);
  const [deptsReady, setDeptsReady] = useState(false);

  useEffect(() => {
    (async () => {
      const sb = createClient();
      const [reg, d] = await Promise.all([
        sb.from('challenge_registrations').select('*').order('created_at', { ascending: false }),
        sb.from('challenge_departments').select('id,is_open,whatsapp_invite_url'),
      ]);
      if (reg.error) toast.error('Erreur de chargement des inscriptions');
      else setRows((reg.data ?? []) as Registration[]);
      if (d.error) toast.error('Erreur de chargement des domaines');
      else { setDepts((d.data ?? []) as DepartmentRow[]); setDeptsReady(true); }
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (deptFilter !== 'all' && r.department !== deptFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.first_name.toLowerCase().includes(q) ||
        r.last_name.toLowerCase().includes(q) ||
        (r.email_normalized ?? '').toLowerCase().includes(q) ||
        r.whatsapp_e164.toLowerCase().includes(q)
      );
    });
  }, [rows, search, deptFilter, statusFilter]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { __total: rows.length };
    for (const d of DEPARTMENTS) map[d.id] = 0;
    for (const r of rows) map[r.department] = (map[r.department] ?? 0) + 1;
    return map;
  }, [rows]);

  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  async function signOut() {
    const sb = createClient();
    await sb.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <div className="min-h-dvh">
      <header className="glass-header sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-semibold text-xom-ink text-[15px] truncate">Tableau de bord</span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-xom-muted/70 hidden sm:inline">
              XOM — 30 jours
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-[12.5px] text-xom-muted hover:text-xom-ink transition px-3 py-2">
              Site public
            </Link>
            <button onClick={signOut}
              className="text-[12.5px] rounded-[10px] border border-xom-indigo-700/15 bg-white/70 px-3.5 py-2 hover:border-xom-indigo-700/30 transition focus-gold">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* KPI grid */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-8">
          <CountCard label="Total" value={counts.__total ?? 0} accent />
          {DEPARTMENTS.map((d) => (
            <CountCard key={d.id} label={d.nameEn} value={counts[d.id] ?? 0} />
          ))}
        </section>

        {/* Filters */}
        <section className="glass-card rounded-[18px] p-4 mb-6">
          <div className="grid gap-3 md:grid-cols-3">
            <input type="search" placeholder="Rechercher nom, e-mail, numéro…"
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full rounded-[10px] border border-xom-indigo-700/15 bg-white/70 px-3.5 py-2.5 text-[14px] outline-none focus-gold" />
            <select value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value as DepartmentId | 'all'); setPage(0); }}
              className="w-full rounded-[10px] border border-xom-indigo-700/15 bg-white/70 px-3.5 py-2.5 text-[14px] outline-none focus-gold">
              <option value="all">Tous les domaines</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>{d.nameEn} — {d.nameFr}</option>
              ))}
            </select>
            <select value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as 'all' | 'active' | 'cancelled'); setPage(0); }}
              className="w-full rounded-[10px] border border-xom-indigo-700/15 bg-white/70 px-3.5 py-2.5 text-[14px] outline-none focus-gold">
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-[12.5px] text-xom-muted">
              {loading ? 'Chargement…' : `${filtered.length} résultat${filtered.length === 1 ? '' : 's'}`}
            </p>
            <a href="/api/admin/export"
              className="text-[12.5px] rounded-[10px] bg-linear-to-b from-xom-indigo-500 to-xom-indigo-700 text-white px-4 py-2 hover:from-xom-indigo-400 hover:to-xom-indigo-500 transition focus-gold">
              Exporter CSV
            </a>
          </div>
        </section>

        {/* Table */}
        <section className="glass-card rounded-[18px] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-xom-muted text-[14px]">Chargement des inscriptions…</div>
          ) : paged.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-xom-ink font-medium">Aucune inscription</p>
              <p className="mt-1 text-[13px] text-xom-muted">
                {rows.length === 0 ? 'Les inscriptions apparaîtront ici en temps réel.' : 'Aucun résultat pour ces filtres.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13.5px]">
                <thead className="bg-white/40 text-xom-muted uppercase text-[10.5px] tracking-[0.12em]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nom</th>
                    <th className="px-4 py-3 font-medium">WhatsApp</th>
                    <th className="px-4 py-3 font-medium">E-mail</th>
                    <th className="px-4 py-3 font-medium">Domaine</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((r) => (
                    <tr key={r.id} className="border-t border-xom-indigo-700/8 hover:bg-white/40 transition">
                      <td className="px-4 py-3 text-xom-ink whitespace-nowrap">
                        {r.first_name} <span className="text-xom-muted">{r.last_name}</span>
                      </td>
                      <td className="px-4 py-3 text-xom-ink font-mono text-[12.5px] whitespace-nowrap">{r.whatsapp_e164}</td>
                      <td className="px-4 py-3 text-xom-muted">{r.email_normalized ?? '—'}</td>
                      <td className="px-4 py-3 text-xom-ink">{r.department}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] ${r.status === 'active' ? 'bg-emerald-500/12 text-emerald-700' : 'bg-red-500/10 text-red-700'}`}>
                          {r.status === 'active' ? 'Actif' : 'Annulé'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xom-muted whitespace-nowrap text-[12.5px]">
                        {new Date(r.created_at).toLocaleString('fr-FR', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 ? (
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-xom-indigo-700/8 bg-white/30">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                className="text-[12.5px] rounded-[8px] border border-xom-indigo-700/15 bg-white/70 px-3 py-1.5 disabled:opacity-40 hover:border-xom-indigo-700/30 transition">
                Précédent
              </button>
              <span className="text-[12px] text-xom-muted">Page {page + 1} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="text-[12.5px] rounded-[8px] border border-xom-indigo-700/15 bg-white/70 px-3 py-1.5 disabled:opacity-40 hover:border-xom-indigo-700/30 transition">
                Suivant
              </button>
            </div>
          ) : null}
        </section>

        {/* Department config */}
        <section className="mt-10">
          <h2 className="display text-[22px] text-xom-ink mb-4">Configuration des domaines</h2>
          {!deptsReady ? (
            <p className="text-[13px] text-xom-muted">Chargement de la configuration…</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {DEPARTMENTS.map((d) => {
                const row = depts.find((x) => x.id === d.id);
                return (
                  <DepartmentConfigRow
                    key={d.id}
                    departmentId={d.id}
                    label={`${d.nameEn} — ${d.nameFr}`}
                    initialUrl={row?.whatsapp_invite_url ?? ''}
                    initialOpen={row?.is_open ?? false}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function CountCard({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`glass-card rounded-[14px] px-4 py-3 ${accent ? 'ring-1 ring-xom-gold-500/40' : ''}`}>
      <div className="text-[10.5px] uppercase tracking-[0.14em] text-xom-muted/80 truncate">{label}</div>
      <div className="mt-1 text-[22px] font-semibold text-xom-ink tracking-tight">{value}</div>
    </div>
  );
}

function DepartmentConfigRow({
  departmentId, label, initialUrl, initialOpen,
}: { departmentId: DepartmentId; label: string; initialUrl: string; initialOpen: boolean }) {
  const [url, setUrl] = useState(initialUrl);
  const [open, setOpen] = useState(initialOpen);
  const [saving, setSaving] = useState(false);

  // Re-sync when parent loads data
  useEffect(() => { setUrl(initialUrl); }, [initialUrl]);
  useEffect(() => { setOpen(initialOpen); }, [initialOpen]);

  async function save() {
    setSaving(true);
    const res = await fetch('/api/admin/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: departmentId, whatsapp_invite_url: url.trim() || null, is_open: open }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok || !data.ok) {
      toast.error(data?.message ?? 'Erreur lors de la sauvegarde');
      return;
    }
    toast.success('Domaine mis à jour');
  }

  const status = open
    ? 'Inscriptions ouvertes'
    : url.trim()
      ? 'Fermé — le lien existe'
      : 'Fermé — aucun lien configuré';

  return (
    <div className="glass-card rounded-[16px] p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[14.5px] font-medium text-xom-ink break-words">{label}</span>
        <label className="inline-flex items-center gap-2 text-[12.5px] text-xom-muted cursor-pointer self-start sm:self-auto shrink-0">
          <input type="checkbox" checked={open} onChange={(e) => setOpen(e.target.checked)}
            className="rounded border-xom-indigo-700/30" />
          <span>{open ? 'Ouvert' : 'Fermé'}</span>
        </label>
      </div>
      <input type="url" placeholder="https://chat.whatsapp.com/…"
        value={url} onChange={(e) => setUrl(e.target.value)}
        className="mt-3 w-full rounded-[10px] border border-xom-indigo-700/15 bg-white/70 px-3.5 py-2.5 text-[12.5px] outline-none focus-gold font-mono truncate"
        title={url} />
      <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-[11.5px] text-xom-muted/80">{status}</span>
        <button onClick={save} disabled={saving}
          className="text-[12.5px] rounded-[10px] bg-linear-to-b from-xom-indigo-500 to-xom-indigo-700 text-white px-4 py-2 hover:from-xom-indigo-400 hover:to-xom-indigo-500 transition focus-gold disabled:opacity-60">
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
