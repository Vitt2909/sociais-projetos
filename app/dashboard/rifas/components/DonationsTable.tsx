'use client';

import { Download, FileSpreadsheet, Printer, Search } from 'lucide-react';
import { useDonations } from '@/lib/hooks/useDonations';
import type { Campanha } from '@/types';

interface DonationsTableProps {
  campaign: Campanha | null;
}

export const DonationsTable = ({ campaign }: DonationsTableProps) => {
  const { donations, loading, error, search, setSearch, exportCsv, exportXlsx, printList } = useDonations(
    campaign?.id
  );

  const actionButtonClass =
    'inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500';

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Doações realizadas</h2>
          <p className="text-sm text-slate-600">Registre e acompanhe as doações confirmadas na campanha atual.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 sm:max-w-sm">
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <span className="sr-only">Buscar doações</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por aluno, turma ou registrador"
              className="flex-1 border-0 bg-transparent p-0 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={exportCsv} className={actionButtonClass}>
              <Download className="h-4 w-4" aria-hidden="true" />
              Exportar CSV
            </button>
            <button type="button" onClick={exportXlsx} className={actionButtonClass}>
              <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
              Exportar XLSX
            </button>
            <button type="button" onClick={printList} className={actionButtonClass}>
              <Printer className="h-4 w-4" aria-hidden="true" />
              Imprimir
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-4">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
                  ID
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
                  Aluno
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
                  Turma
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
                  Peso (kg)
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
                  Qtde Rifas
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
                  Data
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
                  Registrado por
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {donations.map((doacao) => (
                <tr key={doacao.id} className="transition hover:bg-slate-50">
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
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                    Nenhuma doação encontrada para esta campanha.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {loading ? <p className="mt-4 text-sm text-slate-500">Carregando doações...</p> : null}
        {error ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}
      </div>
    </section>
  );
};
