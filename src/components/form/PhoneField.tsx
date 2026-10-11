'use client';
import PhoneInputLib, { type Country } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

type Props = { value: string; onChange: (v: string) => void; onBlur?: () => void; error?: string };

const DEFAULT_COUNTRY: Country = 'FR';

export function PhoneField({ value, onChange, onBlur, error }: Props) {
  return (
    <div>
      <PhoneInputLib
        international
        defaultCountry={DEFAULT_COUNTRY}
        value={value}
        onChange={(v) => onChange(v ?? '')}
        onBlur={onBlur}
        placeholder="6 12 34 56 78"
        className="phone-shell"
        numberInputProps={{
          className:
            'flex-1 min-w-0 rounded-[12px] border border-xom-indigo-700/15 bg-white/75 px-4 py-3 text-[15px] outline-none focus-gold placeholder:text-xom-muted/45 transition-all duration-200 hover:border-xom-indigo-700/25',
        }}
      />
      {error ? <p className="mt-2 text-[13px] text-red-600">{error}</p> : null}
      <style jsx global>{`
        .phone-shell { display: flex; gap: 8px; align-items: stretch; width: 100%; }
        .phone-shell .PhoneInputCountry {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid rgba(46,26,107,0.15);
          background: rgba(255,255,255,0.75);
          padding: 0 14px; border-radius: 12px;
          flex-shrink: 0;
          transition: all 200ms ease;
          min-height: 46px;
        }
        .phone-shell .PhoneInputCountry:hover { border-color: rgba(46,26,107,0.28); }
        .phone-shell .PhoneInputCountrySelect { cursor: pointer; }
        .phone-shell .PhoneInputCountryIcon {
          width: 22px; height: 16px;
          border-radius: 3px; overflow: hidden;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.06);
        }
        .phone-shell .PhoneInputCountrySelectArrow {
          opacity: .45; margin-left: 2px; width: 8px; height: 8px;
        }
      `}</style>
    </div>
  );
}
