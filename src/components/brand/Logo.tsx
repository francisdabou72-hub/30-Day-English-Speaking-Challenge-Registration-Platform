'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';

const TAP_WINDOW_MS = 3000;
const TAP_COUNT = 5;

export function Logo({ size = 56 }: { size?: number }) {
  const router = useRouter();
  const tapsRef = useRef<number[]>([]);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const recent = tapsRef.current.filter((t) => now - t < TAP_WINDOW_MS);
    recent.push(now);
    tapsRef.current = recent;
    if (recent.length >= TAP_COUNT) {
      tapsRef.current = [];
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <button
      type="button"
      onClick={handleTap}
      aria-label="XOM"
      className="inline-flex items-center justify-center gap-3 focus-gold rounded-xl cursor-pointer select-none px-2 py-1"
    >
      <span
        className="relative inline-block rounded-full ring-1 ring-xom-indigo-700/10 shadow-[0_6px_20px_-10px_rgba(46,26,107,0.5)]"
        style={{ width: size, height: size }}
      >
        <Image
          src="/brand/xom-logo.png"
          alt="XOM — Vivez l'anglais"
          fill
          priority
          sizes={`${size}px`}
          className="object-contain"
        />
      </span>
      <span className="text-left leading-none">
        <span className="block font-semibold tracking-tight text-xom-indigo-700 text-[22px]">
          Xom
        </span>
        <span className="mt-1 block text-[10px] uppercase tracking-[0.24em] text-xom-muted/90">
          Vivez l&apos;anglais
        </span>
      </span>
    </button>
  );
}
