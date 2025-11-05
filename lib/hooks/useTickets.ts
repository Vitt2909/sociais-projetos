'use client';

import { useEffect, useMemo, useState } from 'react';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { utils, writeFileXLSX } from 'xlsx';
import { rifasCollection } from '@/lib/firestore';
import type { Rifa } from '@/types';

const download = (filename: string, content: string) => {
  const blob = new Blob([content], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const useTickets = (campanhaId?: string) => {
  const [tickets, setTickets] = useState<Rifa[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campanhaId) {
      setTickets([]);
      return undefined;
    }
    setLoading(true);
    const q = query(rifasCollection, where('campanhaId', '==', campanhaId), orderBy('codigo'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setTickets(snapshot.docs.map((doc) => doc.data()));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [campanhaId]);

  const filtered = useMemo(() => {
    if (!search) return tickets;
    const term = search.toLowerCase();
    return tickets.filter((ticket) =>
      [ticket.codigo, ticket.alunoNome, ticket.turmaNome]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [tickets, search]);

  const exportCsv = () => {
    const headers = ['Código', 'Aluno', 'Turma', 'Data'];
    const rows = filtered.map((ticket) => [
      ticket.codigo,
      ticket.alunoNome,
      ticket.turmaNome,
      ticket.data.toLocaleString(),
    ]);
    const csv = [headers, ...rows]
      .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    download('rifas.csv', csv);
  };

  const exportXlsx = () => {
    const worksheet = utils.json_to_sheet(
      filtered.map((ticket) => ({
        Código: ticket.codigo,
        Aluno: ticket.alunoNome,
        Turma: ticket.turmaNome,
        Data: ticket.data.toLocaleString(),
      }))
    );
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Rifas');
    writeFileXLSX(workbook, 'rifas.xlsx');
  };

  const printList = () => {
    const printWindow = window.open('', 'PRINT', 'height=600,width=900');
    if (!printWindow) return;
    printWindow.document.write('<html><head><title>Rifas</title></head><body>');
    printWindow.document.write('<h1>Lista Mestra de Rifas</h1>');
    printWindow.document.write('<table border="1" cellspacing="0" cellpadding="4">');
    printWindow.document.write('<tr><th>Código</th><th>Aluno</th><th>Turma</th><th>Data</th></tr>');
    filtered.forEach((ticket) => {
      printWindow.document.write(
        `<tr><td>${ticket.codigo}</td><td>${ticket.alunoNome}</td><td>${ticket.turmaNome}</td><td>${ticket.data.toLocaleString()}</td></tr>`
      );
    });
    printWindow.document.write('</table></body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return {
    tickets: filtered,
    loading,
    error,
    search,
    setSearch,
    exportCsv,
    exportXlsx,
    printList,
  };
};
