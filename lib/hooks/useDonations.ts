'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { utils, writeFileXLSX } from 'xlsx';
import { doacoesCollection } from '@/lib/firestore';
import type { Doacao } from '@/types';

const download = (filename: string, content: string, mime = 'text/csv') => {
  const blob = new Blob([content], { type: mime });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const useDonations = (campanhaId?: string) => {
  const [donations, setDonations] = useState<Doacao[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campanhaId) {
      setDonations([]);
      return undefined;
    }
    if (typeof window === 'undefined') {
      return undefined;
    }
    setLoading(true);
    const q = query(
      doacoesCollection(),
      where('campanhaId', '==', campanhaId),
      orderBy('data', 'desc')
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setDonations(snapshot.docs.map((doc) => doc.data()));
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
    if (!search) return donations;
    const term = search.toLowerCase();
    return donations.filter((doacao) =>
      [
        doacao.alunoNome,
        doacao.turmaNome,
        doacao.registradoPor.nome,
        doacao.rifasGeradas.join(','),
      ]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [donations, search]);

  const exportCsv = useCallback(() => {
    const headers = ['ID', 'Aluno', 'Turma', 'Peso (kg)', 'Qtde Rifas', 'Data', 'Registrado por'];
    const rows = filtered.map((doacao) => [
      doacao.id,
      doacao.alunoNome,
      doacao.turmaNome,
      doacao.pesoKg,
      doacao.rifasGeradas.length,
      doacao.data.toLocaleString(),
      `${doacao.registradoPor.nome}`,
    ]);
    const csv = [headers, ...rows]
      .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    download('doacoes.csv', csv);
  }, [filtered]);

  const exportXlsx = useCallback(() => {
    const worksheet = utils.json_to_sheet(
      filtered.map((doacao) => ({
        ID: doacao.id,
        Aluno: doacao.alunoNome,
        Turma: doacao.turmaNome,
        'Peso (kg)': doacao.pesoKg,
        'Qtde Rifas': doacao.rifasGeradas.length,
        Data: doacao.data.toLocaleString(),
        'Registrado por': doacao.registradoPor.nome,
      }))
    );
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Doações');
    writeFileXLSX(workbook, 'doacoes.xlsx');
  }, [filtered]);

  const printList = useCallback(() => {
    const printWindow = window.open('', 'PRINT', 'height=600,width=900');
    if (!printWindow) return;
    printWindow.document.write('<html><head><title>Doações</title></head><body>');
    printWindow.document.write('<h1>Doações</h1>');
    printWindow.document.write('<table border="1" cellspacing="0" cellpadding="4">');
    printWindow.document.write(
      '<tr><th>ID</th><th>Aluno</th><th>Turma</th><th>Peso (kg)</th><th>Qtde Rifas</th><th>Data</th><th>Registrado por</th></tr>'
    );
    filtered.forEach((doacao) => {
      printWindow.document.write(
        `<tr><td>${doacao.id}</td><td>${doacao.alunoNome}</td><td>${doacao.turmaNome}</td><td>${doacao.pesoKg}</td><td>${doacao.rifasGeradas.length}</td><td>${doacao.data.toLocaleString()}</td><td>${doacao.registradoPor.nome}</td></tr>`
      );
    });
    printWindow.document.write('</table></body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, [filtered]);

  return {
    donations: filtered,
    total: donations.length,
    loading,
    error,
    search,
    setSearch,
    exportCsv,
    exportXlsx,
    printList,
  };
};
