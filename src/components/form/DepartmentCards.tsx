'use client';
import { DEPARTMENTS, type DepartmentId } from '@/lib/departments';

type Props = { value: DepartmentId | ''; onChange: (id: DepartmentId) => void; error?: string };

export function DepartmentCards({ value, onChange, error }: Props) {
  return (
    <fieldset>
      <legend className="block text-[13.5px] font-medium text-xom-ink/85 mb-2">
        Ton domaine
      </legend>
      <div role="radiogroup" aria-label="Domaine" className="grid gap-2.5">
        {DEPARTMENTS.map((d) => {
          const selected = value === d.id;
          return (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={selected}
              data-selected={selected}
              onClick={() => onChange(d.id)}
              className="dept-card group text-left rounded-[14px] border border-xom-indigo-700/12 bg-white/55 px-5 py-4 focus-gold"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[15.5px] font-medium text-xom-ink tracking-tight">
                  {d.nameEn} <span aria-hidden className="text-[14px]">🇺🇸</span>
                </span>
                <span className="text-[13px] text-xom-muted/80">
                  {d.nameFr} <span aria-hidden className="text-[12px]">🇫🇷</span>
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-[1.55] text-xom-muted/85">
                {d.descriptionFr}
              </p>
            </button>
          );
        })}
      </div>
      {error ? <p className="mt-2 text-[13px] text-red-600">{error}</p> : null}
    </fieldset>
  );
}
