'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CampaignHeader } from './components/CampaignHeader';
import { RegisterDonationModal } from './components/RegisterDonationModal';
import { DonationsTable } from './components/DonationsTable';
import { TicketsTable } from './components/TicketsTable';
import { Ranking } from './components/Ranking';
import { CampaignHistory } from './components/CampaignHistory';
import { CreateCampaignModal } from './components/CreateCampaignModal';
import { useCampaign } from '@/lib/hooks/useCampaign';
import { useAuditLogs } from '@/lib/hooks/useAuditLogs';

const Tabs = {
  DOACOES: 'doacoes',
  RIFAS: 'rifas',
  AUDITORIA: 'auditoria',
} as const;

export type TabKey = (typeof Tabs)[keyof typeof Tabs];

export const RifaDashboard = () => {
  const { campaign, history, role, user, loading, error, drawWinner, createCampaign } = useCampaign();
  const { logs, loading: auditLoading, error: auditError } = useAuditLogs(campaign?.id);

  const [registerOpen, setRegisterOpen] = useState(false);
  const [rankingOpen, setRankingOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmDrawOpen, setConfirmDrawOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>(Tabs.DOACOES);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [drawing, setDrawing] = useState(false);

  const isCampaignLocked = campaign?.status === 'encerrada' || Boolean(campaign?.vencedor);

  const handleDraw = async () => {
    if (!campaign) return;
    try {
      setDrawing(true);
      await drawWinner();
      setToast({ type: 'success', message: 'Sorteio realizado com sucesso!' });
    } catch (err) {
      setToast({ type: 'error', message: (err as Error).message });
    } finally {
      setDrawing(false);
      setConfirmDrawOpen(false);
    }
  };

  const tabButtonClass = (tab: TabKey) =>
    `inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
      activeTab === tab ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'
    }`;

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <CampaignHeader
          campaign={campaign}
          role={role}
          onRegister={() => setRegisterOpen(true)}
          onDraw={() => setConfirmDrawOpen(true)}
          onViewRanking={() => setRankingOpen(true)}
          drawingDisabled={isCampaignLocked || drawing}
        />

        <nav className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm backdrop-blur-sm">
          <button type="button" onClick={() => setActiveTab(Tabs.DOACOES)} className={tabButtonClass(Tabs.DOACOES)}>
            Doações realizadas
          </button>
          <button type="button" onClick={() => setActiveTab(Tabs.RIFAS)} className={tabButtonClass(Tabs.RIFAS)}>
            Lista mestra de rifas
          </button>
          <button type="button" onClick={() => setActiveTab(Tabs.AUDITORIA)} className={tabButtonClass(Tabs.AUDITORIA)}>
            Auditoria
          </button>
        </nav>

        {activeTab === Tabs.DOACOES ? <DonationsTable campaign={campaign} /> : null}
        {activeTab === Tabs.RIFAS ? <TicketsTable campaign={campaign} /> : null}
        {activeTab === Tabs.AUDITORIA ? (
          <section className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-900">Auditoria</h2>
              <p className="text-sm text-slate-600">
                Registros de auditoria vinculados à campanha ativa, incluindo criação, atualizações e sorteios.
              </p>
            </div>
            <div className="px-6 pb-6 pt-4">
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Quando</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Ação</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Usuário</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Detalhes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {logs.map((log) => (
                      <tr key={log.id} className="transition hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-600">
                          {format(log.timestamp, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">{log.what}</td>
                        <td className="px-4 py-3 text-slate-600">{log.who.nome}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          <pre className="whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3">
                            {JSON.stringify({ before: log.before ?? null, after: log.after ?? null }, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    ))}
                    {!logs.length && !auditLoading ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                          Nenhum evento registrado ainda.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
              {auditLoading ? <p className="mt-4 text-sm text-slate-500">Carregando auditoria...</p> : null}
              {auditError ? <p className="mt-4 text-sm text-red-600">{auditError}</p> : null}
            </div>
          </section>
        ) : null}

        <CampaignHistory history={history} onCreate={() => setCreateOpen(true)} />

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm">
            Carregando campanha...
          </div>
        ) : null}
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">{error}</div>
        ) : null}
      </div>

      <RegisterDonationModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        campaign={campaign}
        user={user}
        onSuccess={(codes) =>
          setToast({ type: 'success', message: `Doação registrada! ${codes.length} código(s) gerado(s).` })
        }
        disabled={isCampaignLocked}
      />

      <Ranking campaign={campaign} open={rankingOpen} onClose={() => setRankingOpen(false)} />

      <CreateCampaignModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={createCampaign} />

      {confirmDrawOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900">Confirmar sorteio</h2>
            <p className="mt-2 text-sm text-slate-600">
              Esta ação é final e irreversível. Deseja sortear o ganhador agora?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDrawOpen(false)}
                className="rounded-md px-4 py-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDraw}
                disabled={drawing}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {drawing ? 'Sorteando...' : 'Confirmar Sorteio 🎲'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition ${
              toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
            }`}
          >
            {toast.message}
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-3 text-xs font-semibold underline"
            >
              Fechar
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default RifaDashboard;
