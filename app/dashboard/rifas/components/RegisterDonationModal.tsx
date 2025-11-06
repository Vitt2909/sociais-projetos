'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { format } from 'date-fns';
import { alunosCollection } from '@/lib/firestore';
import { getFirebaseFunctions } from '@/lib/firebase';
import type { Aluno, Campanha } from '@/types';

interface RegisterDonationModalProps {
  open: boolean;
  onClose: () => void;
  campaign: Campanha | null;
  user: { uid: string; displayName: string | null } | null;
  onSuccess?: (codes: string[]) => void;
  disabled?: boolean;
}

type GenerateRifasResponse = {
  codigos: string[];
};

export const RegisterDonationModal = ({
  open,
  onClose,
  campaign,
  user,
  onSuccess,
  disabled,
}: RegisterDonationModalProps) => {
  const cloudFunctions = typeof window !== 'undefined' ? getFirebaseFunctions() : null;
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [search, setSearch] = useState('');
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [peso, setPeso] = useState('');
  const [data, setData] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<number | null>(null);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const q = query(alunosCollection(), orderBy('nome'));
    const unsub = onSnapshot(q, (snapshot) => {
      setAlunos(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsub();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
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
    searchInputRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setSearch('');
      setSelectedAluno(null);
      setPeso('');
      setPreview(null);
      setGeneratedCodes([]);
      setError(null);
      setData(format(new Date(), 'yyyy-MM-dd'));
    }
  }, [open]);

  const filteredAlunos = useMemo(() => {
    if (!search) return alunos.slice(0, 10);
    const term = search.toLowerCase();
    return alunos.filter((aluno) => aluno.nome.toLowerCase().includes(term)).slice(0, 10);
  }, [alunos, search]);

  const rifasCalculadas = useMemo(() => {
    const pesoNumber = Number(peso.replace(',', '.'));
    if (Number.isNaN(pesoNumber)) return 0;
    return Math.floor(pesoNumber);
  }, [peso]);

  const canSubmit = Boolean(selectedAluno && rifasCalculadas >= 1 && campaign && !disabled);

  const handlePreview = () => {
    if (!selectedAluno) {
      setError('Selecione um aluno para continuar.');
      return;
    }
    if (rifasCalculadas < 1) {
      setError('Peso inválido. Apenas valores a partir de 1 kg geram rifas.');
      return;
    }
    setError(null);
    setPreview(rifasCalculadas);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit || !selectedAluno || !campaign) return;
    try {
      setLoading(true);
      setError(null);
      if (!cloudFunctions) {
        throw new Error('Serviços do Firebase indisponíveis.');
      }
      const callable = httpsCallable(cloudFunctions, 'generateRifas');
      const pesoNumber = Number(peso.replace(',', '.'));
      const result = await callable({
        campanhaId: campaign.id,
        alunoId: selectedAluno.id,
        pesoKg: pesoNumber,
        data,
        registradoPor: {
          userId: user?.uid,
          nome: user?.displayName ?? 'Usuário',
        },
      });
      const payload = result.data as GenerateRifasResponse;
      setGeneratedCodes(payload.codigos ?? []);
      onSuccess?.(payload.codigos ?? []);
      setPreview(null);
      setPeso('');
      setSelectedAluno(null);
      setSearch('');
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? 'Falha ao registrar doação.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedCodes.length) return;
    navigator.clipboard.writeText(generatedCodes.join('\n')).catch(() => {
      setError('Não foi possível copiar os códigos.');
    });
  };

  const handlePrint = () => {
    if (!generatedCodes.length) return;
    const printWindow = window.open('', 'PRINT', 'height=600,width=800');
    if (!printWindow) return;
    printWindow.document.write('<html><head><title>Rifas Geradas</title></head><body>');
    printWindow.document.write('<h1>Rifas Geradas</h1>');
    printWindow.document.write('<ol>');
    generatedCodes.forEach((codigo) => {
      printWindow.document.write(`<li>${codigo}</li>`);
    });
    printWindow.document.write('</ol></body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" role="dialog" aria-modal="true">
      <div ref={dialogRef} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Registrar Doação</h2>
            <p className="mt-1 text-sm text-slate-600">
              Informe o aluno, o peso arrecadado e confirme os dados para gerar os códigos de rifa.
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Aluno</label>
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSelectedAluno(null);
                }}
                placeholder="Busque pelo nome do aluno"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {filteredAlunos.length > 0 ? (
                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-slate-200 bg-white text-sm shadow-lg">
                  {filteredAlunos.map((aluno) => (
                    <li key={aluno.id}>
                      <button
                        type="button"
                        className="flex w-full justify-between px-3 py-2 text-left hover:bg-indigo-50"
                        onClick={() => {
                          setSelectedAluno(aluno);
                          setSearch(aluno.nome);
                        }}
                      >
                        <span>{aluno.nome}</span>
                        <span className="text-xs text-slate-500">Turma {aluno.turmaNome}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            {selectedAluno ? (
              <p className="text-sm text-slate-600">Turma selecionada: <strong>{selectedAluno.turmaNome}</strong></p>
            ) : (
              <p className="text-xs text-slate-500">Selecione um aluno para preencher a turma automaticamente.</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Peso arrecadado (kg)</span>
              <input
                type="number"
                min="1"
                step="0.1"
                value={peso}
                onChange={(event) => setPeso(event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="block text-xs text-slate-500">Frações são arredondadas para baixo. Valores abaixo de 1 são inválidos.</span>
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Data da doação</span>
              <input
                type="date"
                value={data}
                onChange={(event) => setData(event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <div className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Registrado por</span>
              <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                {user?.displayName ?? 'Usuário autenticado'}
              </p>
            </div>
          </div>

          <div className="rounded-md border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-800">
            <p className="font-medium">
              Gerará <span className="font-semibold">{rifasCalculadas}</span> código(s) de rifa.
            </p>
            <p className="mt-1 text-xs">1 kg = 1 rifa. Valores decimais são sempre arredondados para baixo.</p>
          </div>

          {preview ? (
            <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <h3 className="font-semibold text-slate-900">Pré-visualização</h3>
              <p className="mt-1">Esta doação irá gerar {preview} código(s) assim que confirmada.</p>
            </div>
          ) : null}

          {generatedCodes.length ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <h3 className="font-semibold text-emerald-900">Códigos gerados</h3>
              <p className="mt-1">Compartilhe os códigos com o participante.</p>
              <ol className="mt-3 space-y-1 text-emerald-900">
                {generatedCodes.map((codigo) => (
                  <li key={codigo}>{codigo}</li>
                ))}
              </ol>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  Copiar códigos
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="rounded-md border border-emerald-500 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  Imprimir lista
                </button>
              </div>
            </div>
          ) : null}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={handlePreview}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              disabled={loading}
            >
              Gerar {rifasCalculadas} Rifas
            </button>
            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
