'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import type { Campanha } from '@/types';
import type { CreateCampaignPayload } from '@/lib/hooks/useCampaign';

interface CreateCampaignModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateCampaignPayload) => Promise<void>;
}

const defaultPremios: Campanha['premios'] = {
  aluno1: '',
  aluno2: '',
  aluno3: '',
};

export const CreateCampaignModal = ({ open, onClose, onCreate }: CreateCampaignModalProps) => {
  const [nome, setNome] = useState('');
  const [dataSorteio, setDataSorteio] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [premioPrincipal, setPremioPrincipal] = useState('');
  const [premios, setPremios] = useState<Campanha['premios']>(defaultPremios);
  const [metaKg, setMetaKg] = useState('');
  const [ativa, setAtiva] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          last.focus();
          event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === last) {
          first.focus();
          event.preventDefault();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    firstInputRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setNome('');
      setPremioPrincipal('');
      setPremios(defaultPremios);
      setMetaKg('');
      setAtiva(true);
      setError(null);
      setLoading(false);
      setDataSorteio(format(new Date(), 'yyyy-MM-dd'));
    }
  }, [open]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!nome || !premioPrincipal) {
      setError('Preencha nome e prêmio principal da campanha.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onCreate({
        nome,
        dataSorteio: new Date(dataSorteio),
        premioPrincipal,
        premios,
        metaKg: metaKg ? Number(metaKg) : undefined,
        ativa,
      });
      onClose();
    } catch (err) {
      setError((err as Error).message ?? 'Erro ao criar campanha.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" role="dialog" aria-modal="true">
      <div ref={dialogRef} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Criar nova campanha</h2>
            <p className="mt-1 text-sm text-slate-600">
              Defina informações básicas, prêmios e meta de arrecadação. Apenas uma campanha pode permanecer ativa.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <span className="sr-only">Fechar</span>✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Nome da campanha</span>
            <input
              ref={firstInputRef}
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Data do sorteio</span>
              <input
                type="date"
                value={dataSorteio}
                onChange={(event) => setDataSorteio(event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Prêmio principal</span>
              <input
                type="text"
                value={premioPrincipal}
                onChange={(event) => setPremioPrincipal(event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          </div>

          <fieldset className="rounded-md border border-slate-200 p-4">
            <legend className="px-2 text-sm font-semibold text-slate-700">Prêmios de ranking</legend>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Aluno — 1º lugar</span>
                <input
                  type="text"
                  value={premios.aluno1}
                  onChange={(event) => setPremios((prev) => ({ ...prev, aluno1: event.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Aluno — 2º lugar</span>
                <input
                  type="text"
                  value={premios.aluno2}
                  onChange={(event) => setPremios((prev) => ({ ...prev, aluno2: event.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Aluno — 3º lugar</span>
                <input
                  type="text"
                  value={premios.aluno3}
                  onChange={(event) => setPremios((prev) => ({ ...prev, aluno3: event.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Turma — destaque</span>
                <input
                  type="text"
                  value={premios.turma1 ?? ''}
                  onChange={(event) => setPremios((prev) => ({ ...prev, turma1: event.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
            </div>
          </fieldset>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Meta de arrecadação (kg)</span>
            <input
              type="number"
              min="0"
              step="1"
              value={metaKg}
              onChange={(event) => setMetaKg(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={ativa}
              onChange={(event) => setAtiva(event.target.checked)}
              className="h-4 w-4 rounded border border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Ativar campanha imediatamente (desativa a anterior automaticamente).</span>
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Criar campanha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
