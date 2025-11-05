'use client';

import { Campanha } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ButtonHTMLAttributes } from 'react';

type CampaignHeaderProps = {
  campaign: Campanha | null;
  role: 'admin' | 'monitor' | 'prof' | null;
  onRegister: () => void;
  onDraw: () => void;
  onViewRanking: () => void;
  drawingDisabled?: boolean;
};

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon?: string;
};

const ActionButton = ({ label, icon, ...rest }: ActionButtonProps) => (
  <button
    {...rest}
    className={`flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 ${rest.className ?? ''}`}
  >
    <span>{label}</span>
    {icon ? <span aria-hidden>{icon}</span> : null}
  </button>
);

export const CampaignHeader = ({
  campaign,
  role,
  onRegister,
  onDraw,
  onViewRanking,
  drawingDisabled,
}: CampaignHeaderProps) => {
  const isActive = campaign?.status === 'ativa';
  const sortDisabled = !isActive || drawingDisabled || role !== 'admin';
  const registerDisabled = !isActive || (role !== 'admin' && role !== 'monitor' && role !== 'prof');

  return (
    <header className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">🎟️ Rifa — Controle de Participações e Sorteio</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Acompanhe o desempenho da campanha ativa, registre novas doações e realize o sorteio final de forma segura.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ActionButton
            onClick={onRegister}
            label="Registrar Doação"
            icon="➕"
            disabled={registerDisabled}
            aria-disabled={registerDisabled}
          />
          <ActionButton
            onClick={onDraw}
            label="Sortear Ganhador"
            icon="🎲"
            disabled={sortDisabled}
            aria-disabled={sortDisabled}
          />
          <ActionButton onClick={onViewRanking} label="Ver Ranking" icon="🏆" />
        </div>
      </div>

      {campaign ? (
        <div className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 xl:grid-cols-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-500">Campanha Ativa</h2>
            <p className="mt-1 text-lg font-semibold text-slate-900">{campaign.nome}</p>
            <dl className="mt-2 space-y-1 text-sm text-slate-600">
              <div>
                <dt>Data do sorteio</dt>
                <dd>{format(campaign.dataSorteio, 'dd/MM/yyyy', { locale: ptBR })}</dd>
              </div>
              <div>
                <dt>Prêmio principal</dt>
                <dd>{campaign.premioPrincipal}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd className="font-medium text-indigo-600">{campaign.status === 'ativa' ? 'Ativa' : 'Encerrada'}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-500">Totais</h2>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              <li className="flex justify-between"><span>Peso arrecadado</span><span>{campaign.counters.totalKg.toLocaleString()} kg</span></li>
              <li className="flex justify-between"><span>Rifas geradas</span><span>{campaign.counters.totalRifas.toLocaleString()}</span></li>
              <li className="flex justify-between"><span>Alunos participantes</span><span>{campaign.counters.totalAlunos.toLocaleString()}</span></li>
              <li className="flex justify-between"><span>Turmas participantes</span><span>{campaign.counters.totalTurmas.toLocaleString()}</span></li>
            </ul>
          </div>
          <div className="md:col-span-2 xl:col-span-1">
            <h2 className="text-sm font-semibold text-slate-500">Progresso</h2>
            {campaign.metaKg ? (
              <div className="mt-3">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>{campaign.counters.totalKg.toLocaleString()} kg</span>
                  <span>Meta: {campaign.metaKg.toLocaleString()} kg</span>
                </div>
                <div className="mt-1 h-3 w-full rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${Math.min(100, (campaign.counters.totalKg / (campaign.metaKg || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Nenhuma meta cadastrada para esta campanha.</p>
            )}
          </div>
          {campaign.vencedor ? (
            <div className="md:col-span-2 xl:col-span-1">
              <h2 className="text-sm font-semibold text-slate-500">Ganhador</h2>
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <p className="font-semibold">{campaign.vencedor.alunoNome}</p>
                <p className="text-emerald-700">Turma {campaign.vencedor.turmaNome}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-emerald-600">Código vencedor</p>
                <p className="text-lg font-bold">{campaign.vencedor.codigo}</p>
                <p className="mt-2 text-xs text-emerald-700">
                  Sorteado em {format(campaign.vencedor.data, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Nenhuma campanha ativa encontrada. Crie uma nova campanha para iniciar uma rifa.
        </div>
      )}
    </header>
  );
};
