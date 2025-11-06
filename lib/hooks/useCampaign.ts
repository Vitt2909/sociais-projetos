'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  onSnapshot,
  query,
  where,
  doc,
  runTransaction,
  collection,
  updateDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth, getFirebaseFirestore, getFirebaseFunctions } from '@/lib/firebase';
import {
  activeCampaignQuery,
  campaignHistoryQuery,
  campanhasCollection,
  auditoriaCollection,
} from '@/lib/firestore';
import type { Campanha, Usuario } from '@/types';

export type CreateCampaignPayload = {
  nome: string;
  dataSorteio: Date;
  premioPrincipal: string;
  premios: Campanha['premios'];
  metaKg?: number;
  ativa: boolean;
};

type DrawWinnerResponse = {
  codigo: string;
  alunoId: string;
  alunoNome: string;
  turmaNome: string;
  data: string;
};

type UseCampaignState = {
  campaign: Campanha | null;
  history: Campanha[];
  role: Usuario['role'] | null;
  user: { uid: string; displayName: string | null } | null;
  loading: boolean;
  error: string | null;
  drawWinner: () => Promise<void>;
  createCampaign: (payload: CreateCampaignPayload) => Promise<void>;
  setCampaignStatus: (status: Campanha['status']) => Promise<void>;
};

export const useCampaign = (): UseCampaignState => {
  const [campaign, setCampaign] = useState<Campanha | null>(null);
  const [history, setHistory] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ uid: string; displayName: string | null } | null>(null);
  const [role, setRole] = useState<Usuario['role'] | null>(null);

  const auth = typeof window !== 'undefined' ? getFirebaseAuth() : null;
  const db = typeof window !== 'undefined' ? getFirebaseFirestore() : null;
  const functions = typeof window !== 'undefined' ? getFirebaseFunctions() : null;

  useEffect(() => {
    if (!db) {
      return;
    }
    const unsub = onSnapshot(activeCampaignQuery(), (snapshot) => {
      if (snapshot.empty) {
        setCampaign(null);
      } else {
        setCampaign(snapshot.docs[0].data());
      }
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });
    return () => unsub();
  }, [db]);

  useEffect(() => {
    if (!db) {
      return;
    }
    const unsub = onSnapshot(campaignHistoryQuery(), (snapshot) => {
      setHistory(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsub();
  }, [db]);

  useEffect(() => {
    if (!auth || !db) {
      return () => {};
    }
    let unsubscribeUsuario: (() => void) | null = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (unsubscribeUsuario) {
        unsubscribeUsuario();
        unsubscribeUsuario = null;
      }
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        return;
      }
      setUser({ uid: firebaseUser.uid, displayName: firebaseUser.displayName });
      const usuarioDoc = doc(db, 'usuarios', firebaseUser.uid);
      unsubscribeUsuario = onSnapshot(usuarioDoc, (snapshot) => {
        if (!snapshot.exists()) {
          setRole(null);
          return;
        }
        const data = snapshot.data() as Usuario;
        setRole(data.role);
      });
    });

    return () => {
      if (unsubscribeUsuario) {
        unsubscribeUsuario();
      }
      unsubscribeAuth();
    };
  }, [auth, db]);

  const drawWinner = useCallback(async () => {
    if (!campaign) {
      throw new Error('Nenhuma campanha ativa para sortear.');
    }
    if (role !== 'admin') {
      throw new Error('Permissão negada: apenas administradores podem sortear.');
    }
    if (!functions) {
      throw new Error('Serviços do Firebase indisponíveis.');
    }
    const callable = httpsCallable(functions, 'drawWinner');
    const result = await callable({ campanhaId: campaign.id });
    const payload = result.data as { vencedor: DrawWinnerResponse };
    if (!payload?.vencedor) {
      throw new Error('Não foi possível obter o ganhador.');
    }
  }, [campaign, functions, role]);

  const createCampaign = useCallback(
    async ({ nome, dataSorteio, premioPrincipal, premios, metaKg, ativa }: CreateCampaignPayload) => {
      if (role !== 'admin') {
        throw new Error('Permissão negada: apenas administradores podem criar campanhas.');
      }
      if (!db) {
        throw new Error('Serviços do Firebase indisponíveis.');
      }
      await runTransaction(db, async (transaction) => {
        const activeCampaignRefs = ativa
          ? await getDocs(query(campanhasCollection(), where('status', '==', 'ativa'))).then((snapshot) =>
              snapshot.docs.map((docSnap) => docSnap.ref),
            )
          : [];

        activeCampaignRefs.forEach((docRef) => {
          transaction.update(docRef, { status: 'encerrada' });
        });

        const campanhaRef = doc(collection(db, 'campanhas'));
        transaction.set(campanhaRef, {
          nome,
          dataSorteio,
          premioPrincipal,
          premios,
          metaKg: metaKg ?? null,
          status: ativa ? 'ativa' : 'encerrada',
          counters: { totalKg: 0, totalRifas: 0, totalAlunos: 0, totalTurmas: 0 },
          lastSerial: 0,
        });

        transaction.set(doc(collection(db, 'auditoria')), {
          who: { userId: user?.uid ?? 'desconhecido', nome: user?.displayName ?? 'Desconhecido' },
          what: 'create_campaign',
          entity: campanhaRef.id,
          after: {
            nome,
            dataSorteio,
            premioPrincipal,
            premios,
            metaKg: metaKg ?? null,
            status: ativa ? 'ativa' : 'encerrada',
          },
          timestamp: new Date(),
        });
      });
    },
    [db, role, user?.uid, user?.displayName]
  );

  const setCampaignStatus = useCallback(
    async (status: Campanha['status']) => {
      if (!campaign) return;
      if (role !== 'admin') {
        throw new Error('Permissão negada: apenas administradores podem alterar campanha.');
      }
      if (!db) {
        throw new Error('Serviços do Firebase indisponíveis.');
      }
      const campaignRef = doc(db, 'campanhas', campaign.id);
      await updateDoc(campaignRef, { status });
      const auditLogRef = doc(auditoriaCollection());
      await setDoc(auditLogRef, {
        id: auditLogRef.id,
        who: { userId: user?.uid ?? 'desconhecido', nome: user?.displayName ?? 'Desconhecido' },
        what: 'update_campaign_status',
        entity: campaign.id,
        before: { status: campaign.status },
        after: { status },
        timestamp: new Date(),
      });
    },
    [campaign, db, role, user?.uid, user?.displayName]
  );

  return {
    campaign,
    history,
    role,
    user,
    loading,
    error,
    drawWinner,
    createCampaign,
    setCampaignStatus,
  };
};
