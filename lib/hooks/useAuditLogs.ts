'use client';

import { useEffect, useState } from 'react';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { auditoriaCollection } from '@/lib/firestore';
import type { AuditoriaLog } from '@/types';

export const useAuditLogs = (entityId?: string) => {
  const [logs, setLogs] = useState<AuditoriaLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entityId) {
      setLogs([]);
      return undefined;
    }
    if (typeof window === 'undefined') {
      return undefined;
    }
    setLoading(true);
    const q = query(
      auditoriaCollection(),
      where('entity', '==', entityId),
      orderBy('timestamp', 'desc')
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setLogs(snapshot.docs.map((doc) => doc.data()));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [entityId]);

  return { logs, loading, error };
};
