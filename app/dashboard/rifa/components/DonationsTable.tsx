'use client';

import { useDonations } from '@/lib/hooks/useDonations';
import type { Campanha } from '@/types';

interface DonationsTableProps {
  campaign: Campanha | null;
}

export const DonationsTable = ({ campaign }: DonationsTableProps) => {
  const { donations, loading, error, search, setSearch, exportCsv, exportXlsx, printList } = useDonations(
    campaign?.id
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por aluno, turma ou registrador"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:w-72"
          />
        </div>
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
              <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">ID</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">Aluno</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">Turma</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">Peso (kg)</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">Qtde Rifas</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">Data</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">Registrado por</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {donations.map((doacao) => (
              <tr key={doacao.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">{doacao.id}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{doacao.alunoNome}</td>
                <td className="px-4 py-3 text-slate-600">{doacao.turmaNome}</td>
                <td className="px-4 py-3 text-slate-600">{doacao.pesoKg.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-600">{doacao.rifasGeradas.length}</td>
                <td className="px-4 py-3 text-slate-600">{doacao.data.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-600">{doacao.registradoPor.nome}</td>
              </tr>
            ))}
            {!donations.length && !loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
                  Nenhuma doação encontrada para esta campanha.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {loading ? <p className="text-sm text-slate-500">Carregando doações...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </section>
  );
};
