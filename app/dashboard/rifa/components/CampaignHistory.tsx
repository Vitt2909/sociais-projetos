'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Campanha } from '@/types';

interface CampaignHistoryProps {
  history: Campanha[];
  onCreate: () => void;
}

export const CampaignHistory = ({ history, onCreate }: CampaignHistoryProps) => {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Histórico de Campanhas</h2>
          <p className="text-sm text-slate-600">Consulte campanhas anteriores e acompanhe sua evolução.</p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          + Criar Nova Campanha
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {history.map((campanha) => (
          <article key={campanha.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <header className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{campanha.nome}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  campanha.status === 'ativa'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {campanha.status === 'ativa' ? 'Ativa' : 'Encerrada'}
              </span>
            </header>
            <dl className="mt-3 space-y-2 text-sm text-slate-600">
              <div>
                <dt>Data do sorteio</dt>
                <dd>{format(campanha.dataSorteio, 'dd/MM/yyyy', { locale: ptBR })}</dd>
              </div>
              <div>
                <dt>Prêmio principal</dt>
                <dd>{campanha.premioPrincipal}</dd>
              </div>
              <div>
                <dt>Meta</dt>
                <dd>{campanha.metaKg ? `${campanha.metaKg.toLocaleString()} kg` : 'Sem meta definida'}</dd>
              </div>
            </dl>
            <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">Resumo final</p>
              <ul className="mt-2 space-y-1">
                <li>Peso arrecadado: {campanha.counters.totalKg.toLocaleString()} kg</li>
                <li>Rifas geradas: {campanha.counters.totalRifas.toLocaleString()}</li>
                <li>Participantes: {campanha.counters.totalAlunos.toLocaleString()} alunos / {campanha.counters.totalTurmas.toLocaleString()} turmas</li>
              </ul>
            </div>
            {campanha.vencedor ? (
              <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                <p className="font-semibold text-amber-900">Ganhador</p>
                <p>{campanha.vencedor.alunoNome} — Turma {campanha.vencedor.turmaNome}</p>
                <p>Código: {campanha.vencedor.codigo}</p>
                <p>Sorteado em {format(campanha.vencedor.data, 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
              </div>
            ) : null}
          </article>
        ))}
        {!history.length ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Nenhuma campanha registrada ainda. Crie uma nova campanha para começar.
          </div>
        ) : null}
      </div>
    </section>
  );
};
