'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Award,
  CalendarDays,
  Gift,
  GraduationCap,
  Scale,
  Target,
  Ticket,
  Users,
} from 'lucide-react';
import type { Campanha } from '@/types';

interface CampaignHistoryProps {
  history: Campanha[];
  onCreate: () => void;
}

export const CampaignHistory = ({ history, onCreate }: CampaignHistoryProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Histórico de Campanhas</h2>
          <p className="text-sm text-slate-600">Consulte campanhas anteriores e acompanhe sua evolução.</p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          + Criar Nova Campanha
        </button>
      </div>

      <div className="grid gap-4 px-6 py-6 md:grid-cols-2 xl:grid-cols-3">
        {history.map((campanha) => (
          <article key={campanha.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{campanha.nome}</h3>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  campanha.status === 'ativa' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {campanha.status === 'ativa' ? 'Ativa' : 'Encerrada'}
              </span>
            </header>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                <span>{format(campanha.dataSorteio, 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                <span>{campanha.premioPrincipal}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                <span>
                  {campanha.metaKg ? `${campanha.metaKg.toLocaleString()} kg de meta` : 'Sem meta definida'}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-700">Resumo final</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                  <span>{campanha.counters.totalKg.toLocaleString()} kg arrecadados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                  <span>{campanha.counters.totalRifas.toLocaleString()} rifas emitidas</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                  <span>{campanha.counters.totalTurmas.toLocaleString()} turmas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                  <span>{campanha.counters.totalAlunos.toLocaleString()} alunos</span>
                </div>
              </div>
            </div>

            {campanha.vencedor ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-800">
                <div className="flex items-center gap-2 text-amber-700">
                  <Award className="h-4 w-4" aria-hidden="true" />
                  <p className="font-semibold text-amber-900">Ganhador</p>
                </div>
                <p className="mt-2">
                  {campanha.vencedor.alunoNome} — Turma {campanha.vencedor.turmaNome}
                </p>
                <p className="text-sm font-semibold text-amber-900">Código: {campanha.vencedor.codigo}</p>
                <p className="text-xs text-amber-700">
                  Sorteado em {format(campanha.vencedor.data, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </p>
              </div>
            ) : null}
          </article>
        ))}

        {!history.length ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center text-sm text-slate-500">
            Nenhuma campanha registrada ainda. Crie uma nova campanha para começar.
          </div>
        ) : null}
      </div>
    </section>
  );
};
