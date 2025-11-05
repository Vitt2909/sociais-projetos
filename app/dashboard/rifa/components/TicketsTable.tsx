'use client';

import { useTickets } from '@/lib/hooks/useTickets';
import type { Campanha } from '@/types';

interface TicketsTableProps {
  campaign: Campanha | null;
}

export const TicketsTable = ({ campaign }: TicketsTableProps) => {
  const { tickets, loading, error, search, setSearch, exportCsv, exportXlsx, printList } = useTickets(
    campaign?.id
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por código, aluno ou turma"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:w-72"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportCsv}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={exportXlsx}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Exportar XLSX
          </button>
          <button
            type="button"
            onClick={printList}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Imprimir
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">Código</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">Aluno</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">Turma</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">{ticket.codigo}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{ticket.alunoNome}</td>
                <td className="px-4 py-3 text-slate-600">{ticket.turmaNome}</td>
                <td className="px-4 py-3 text-slate-600">{ticket.data.toLocaleString()}</td>
              </tr>
            ))}
            {!tickets.length && !loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-500">
                  Nenhuma rifa gerada para esta campanha até o momento.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {loading ? <p className="text-sm text-slate-500">Carregando rifas...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </section>
  );
};
