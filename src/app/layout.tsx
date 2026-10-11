import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
});

export const metadata: Metadata = {
  title: 'XOM — 30 jours pour oser parler anglais',
  description:
    "Défi gratuit de 30 jours pour pratiquer l'anglais, dépasser la peur de parler et progresser avec une communauté organisée par domaine.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased bg-[#FAFAFB] text-[#0F0A2E]">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
