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

  return (
    <main className="space-y-10 px-4 py-10 sm:px-6 lg:px-10">
      <CampaignHeader
        campaign={campaign}
        role={role}
        onRegister={() => setRegisterOpen(true)}
        onDraw={() => setConfirmDrawOpen(true)}
        onViewRanking={() => setRankingOpen(true)}
        drawingDisabled={isCampaignLocked || drawing}
      />

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab(Tabs.DOACOES)}
            className={`rounded-md px-3 py-2 transition ${
              activeTab === Tabs.DOACOES ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100'
            }`}
          >
            Doações realizadas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(Tabs.RIFAS)}
            className={`rounded-md px-3 py-2 transition ${
              activeTab === Tabs.RIFAS ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100'
            }`}
          >
            Lista mestra de rifas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(Tabs.AUDITORIA)}
            className={`rounded-md px-3 py-2 transition ${
              activeTab === Tabs.AUDITORIA ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100'
            }`}
          >
            Auditoria
          </button>
        </nav>

        <div className="mt-6">
          {activeTab === Tabs.DOACOES ? <DonationsTable campaign={campaign} /> : null}
          {activeTab === Tabs.RIFAS ? <TicketsTable campaign={campaign} /> : null}
          {activeTab === Tabs.AUDITORIA ? (
            <section className="space-y-4">
              <p className="text-sm text-slate-600">
                Registros de auditoria vinculados à campanha ativa, incluindo criação, atualizações e sorteios.
              </p>
              <div className="overflow-x-auto">
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
                      <tr key={log.id}>
                        <td className="px-4 py-3 text-slate-600">
                          {format(log.timestamp, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">{log.what}</td>
                        <td className="px-4 py-3 text-slate-600">{log.who.nome}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          <pre className="whitespace-pre-wrap break-words rounded bg-slate-50 p-2">
                            {JSON.stringify({ before: log.before ?? null, after: log.after ?? null }, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    ))}
                    {!logs.length && !auditLoading ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-500">
                          Nenhum evento registrado ainda.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
              {auditLoading ? <p className="text-sm text-slate-500">Carregando auditoria...</p> : null}
              {auditError ? <p className="text-sm text-red-600">{auditError}</p> : null}
            </section>
          ) : null}
        </div>
      </div>

      <CampaignHistory history={history} onCreate={() => setCreateOpen(true)} />

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

      <CreateCampaignModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createCampaign}
      />

      {confirmDrawOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900">Confirmar sorteio</h2>
            <p className="mt-2 text-sm text-slate-600">
              Esta ação é final e irreversível. Deseja sortear o ganhador agora?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDrawOpen(false)}
                className="rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDraw}
                disabled={drawing}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
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

      {loading ? <p className="text-sm text-slate-500">Carregando campanha...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </main>
  );
};

export default RifaDashboard;
