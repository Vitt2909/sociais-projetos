'use client';

import { useEffect, useMemo, useState } from 'react';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { doacoesCollection } from '@/lib/firestore';
import type { Campanha, Doacao } from '@/types';

type RankingEntry = {
  id: string;
  nome: string;
  totalKg: number;
  totalRifas: number;
};

export const useRanking = (campanha?: Campanha | null) => {
  const [donations, setDonations] = useState<Doacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campanha) {
      setDonations([]);
      return undefined;
    }
    setLoading(true);
    const q = query(
      doacoesCollection,
      where('campanhaId', '==', campanha.id),
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
  }, [campanha?.id]);

  const ranking = useMemo(() => {
    const alunosMap = new Map<string, RankingEntry>();
    const turmasMap = new Map<string, RankingEntry>();

    donations.forEach((doacao) => {
      const aluno = alunosMap.get(doacao.alunoId) ?? {
        id: doacao.alunoId,
        nome: doacao.alunoNome,
        totalKg: 0,
        totalRifas: 0,
      };
      aluno.totalKg += doacao.pesoKg;
      aluno.totalRifas += doacao.rifasGeradas.length;
      alunosMap.set(doacao.alunoId, aluno);

      const turma = turmasMap.get(doacao.turmaId) ?? {
        id: doacao.turmaId,
        nome: doacao.turmaNome,
        totalKg: 0,
        totalRifas: 0,
      };
      turma.totalKg += doacao.pesoKg;
      turma.totalRifas += doacao.rifasGeradas.length;
      turmasMap.set(doacao.turmaId, turma);
    });

    const compare = (a: RankingEntry, b: RankingEntry) => b.totalKg - a.totalKg;

    const alunos = Array.from(alunosMap.values()).sort(compare).slice(0, 3);
    const turmas = Array.from(turmasMap.values()).sort(compare).slice(0, 3);

    return { alunos, turmas };
  }, [donations]);

  return {
    loading,
    error,
    alunos: ranking.alunos,
    turmas: ranking.turmas,
    premios: campanha?.premios ?? null,
  };
};
