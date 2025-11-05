'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Award,
  CalendarDays,
  Dice5,
  Gift,
  GraduationCap,
  PlusCircle,
  Scale,
  Target,
  Ticket,
  Trophy,
  Users,
} from 'lucide-react';
import { Campanha } from '@/types';

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
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
};

const ActionButton = ({ label, icon, variant = 'secondary', className, ...rest }: ActionButtonProps) => (
  <button
    {...rest}
    className={clsx(
      'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
      {
        primary:
          'border-transparent bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-indigo-600',
        secondary:
          'border-slate-200 bg-white/90 text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 focus-visible:outline-indigo-500',
        ghost: 'border-transparent bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:outline-indigo-500',
      }[variant],
      className
    )}
  >
    {icon ? (
      <span aria-hidden className="flex h-4 w-4 items-center justify-center text-current">
        {icon}
      </span>
    ) : null}
    <span>{label}</span>
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

  const highlightCards = campaign
    ? [
        {
          label: 'Peso arrecadado',
          value: `${campaign.counters.totalKg.toLocaleString()} kg`,
          icon: <Scale aria-hidden className="h-5 w-5" />,
        },
        {
          label: 'Rifas geradas',
          value: campaign.counters.totalRifas.toLocaleString(),
          icon: <Ticket aria-hidden className="h-5 w-5" />,
        },
        {
          label: 'Alunos participantes',
          value: campaign.counters.totalAlunos.toLocaleString(),
          icon: <Users aria-hidden className="h-5 w-5" />,
        },
        {
          label: 'Turmas participantes',
          value: campaign.counters.totalTurmas.toLocaleString(),
          icon: <GraduationCap aria-hidden className="h-5 w-5" />,
        },
      ]
    : [];

  const hasMeta = Boolean(campaign?.metaKg);
  const metaProgress = hasMeta
    ? Math.min(100, (campaign!.counters.totalKg / (campaign!.metaKg || 1)) * 100)
    : 0;

  return (
    <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
      <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-transparent px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Campanha de arrecadação</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">🎟️ Rifa — Controle de Participações e Sorteio</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Acompanhe o desempenho da campanha ativa, registre novas doações e realize o sorteio final de forma segura.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ActionButton
              onClick={onRegister}
              label="Registrar Doação"
              icon={<PlusCircle aria-hidden className="h-4 w-4" />}
              disabled={registerDisabled}
              aria-disabled={registerDisabled}
              variant="primary"
            />
            <ActionButton
              onClick={onDraw}
              label="Sortear Ganhador"
              icon={<Dice5 aria-hidden className="h-4 w-4" />}
              disabled={sortDisabled}
              aria-disabled={sortDisabled}
            />
            <ActionButton
              onClick={onViewRanking}
              label="Ver Ranking"
              icon={<Trophy aria-hidden className="h-4 w-4" />}
              variant="ghost"
            />
          </div>
        </div>
      </div>

      {campaign ? (
        <div className="space-y-6 px-6 pb-6 pt-6 sm:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <Gift aria-hidden className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Campanha ativa</p>
                  <p className="text-xl font-semibold text-slate-900">{campaign.nome}</p>
                </div>
              </div>
              <span
                className={clsx(
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
                  isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                )}
              >
                {isActive ? 'Ativa' : 'Encerrada'}
              </span>
            </div>
            <dl className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start gap-3">
                <span className="rounded-md bg-slate-100 p-2 text-indigo-500">
                  <CalendarDays aria-hidden className="h-4 w-4" />
                </span>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Data do sorteio</dt>
                  <dd className="font-medium text-slate-800">
                    {format(campaign.dataSorteio, 'dd/MM/yyyy', { locale: ptBR })}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="rounded-md bg-slate-100 p-2 text-indigo-500">
                  <Gift aria-hidden className="h-4 w-4" />
                </span>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Prêmio principal</dt>
                  <dd className="font-medium text-slate-800">{campaign.premioPrincipal}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="rounded-md bg-slate-100 p-2 text-indigo-500">
                  <Target aria-hidden className="h-4 w-4" />
                </span>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Meta da campanha</dt>
                  <dd className="font-medium text-slate-800">
                    {campaign.metaKg ? `${campaign.metaKg.toLocaleString()} kg` : 'Sem meta definida'}
                  </dd>
                </div>
              </div>
            </dl>
            {hasMeta ? (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                  <span>{campaign.counters.totalKg.toLocaleString()} kg</span>
                  <span>Meta: {campaign!.metaKg!.toLocaleString()} kg</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${metaProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="mt-6 text-sm text-slate-500">Nenhuma meta cadastrada para esta campanha.</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {highlightCards.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    {stat.icon}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{stat.label}</p>
                    <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {campaign.vencedor ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Award aria-hidden className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Ganhador</p>
                  <p className="text-lg font-semibold text-emerald-900">{campaign.vencedor.alunoNome}</p>
                  <p className="text-sm text-emerald-700">Turma {campaign.vencedor.turmaNome}</p>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-emerald-200 bg-white/70 px-4 py-3 text-sm text-emerald-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Código vencedor</p>
                <p className="text-lg font-bold text-emerald-900">{campaign.vencedor.codigo}</p>
                <p className="mt-2 text-xs text-emerald-700">
                  Sorteado em {format(campaign.vencedor.data, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="px-6 py-12 sm:px-8">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
            Nenhuma campanha ativa encontrada. Crie uma nova campanha para iniciar uma rifa.
          </div>
        </div>
      )}
    </header>
  );
};
