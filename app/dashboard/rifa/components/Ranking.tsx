'use client';

import { useRanking } from '@/lib/hooks/useRanking';
import type { Campanha } from '@/types';

interface RankingProps {
  campaign: Campanha | null;
  open: boolean;
  onClose: () => void;
}

export const Ranking = ({ campaign, open, onClose }: RankingProps) => {
  const { alunos, turmas, premios, loading, error } = useRanking(campaign);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Ranking da Campanha</h2>
            <p className="mt-1 text-sm text-slate-600">
              Top 3 alunos e turmas com maior peso arrecadado na campanha atual.
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

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Alunos</h3>
            <p className="text-xs text-slate-500">Prêmios: {premios?.aluno1}, {premios?.aluno2}, {premios?.aluno3}</p>
            <ol className="mt-4 space-y-3">
              {alunos.map((aluno, index) => (
                <li key={aluno.id} className="rounded-md bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">#{index + 1} {aluno.nome}</span>
                    <span>{aluno.totalKg.toLocaleString()} kg</span>
                  </div>
                  <p className="text-xs text-slate-500">Rifas geradas: {aluno.totalRifas}</p>
                </li>
              ))}
              {!alunos.length && !loading ? (
                <li className="rounded-md border border-dashed border-slate-300 p-3 text-center text-sm text-slate-500">
                  Nenhuma doação registrada ainda.
                </li>
              ) : null}
            </ol>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Turmas</h3>
            <p className="text-xs text-slate-500">
              Prêmio sugerido: {premios?.turma1 ?? 'Defina o prêmio da turma na campanha'}
            </p>
            <ol className="mt-4 space-y-3">
              {turmas.map((turma, index) => (
                <li key={turma.id} className="rounded-md bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">#{index + 1} {turma.nome}</span>
                    <span>{turma.totalKg.toLocaleString()} kg</span>
                  </div>
                  <p className="text-xs text-slate-500">Rifas geradas: {turma.totalRifas}</p>
                </li>
              ))}
              {!turmas.length && !loading ? (
                <li className="rounded-md border border-dashed border-slate-300 p-3 text-center text-sm text-slate-500">
                  Nenhuma doação registrada ainda.
                </li>
              ) : null}
            </ol>
          </div>
        </div>

        {loading ? <p className="mt-4 text-sm text-slate-500">Calculando ranking...</p> : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
};
