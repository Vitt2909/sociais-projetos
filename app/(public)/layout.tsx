import type { ReactNode } from 'react';
import Link from 'next/link';

export default function PublicLayout({ children }: { children: ReactNode }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold text-slate-900">
            Campanha Solidária
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Link
              href="/transparencia"
              className="rounded-md px-3 py-2 transition hover:bg-indigo-50 hover:text-indigo-600"
            >
              Transparência
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-white/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; {currentYear} Campanha Solidária. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/transparencia" className="transition hover:text-indigo-600">
              Transparência
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
