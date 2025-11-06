import {
  collection,
  query,
  where,
  orderBy,
  limit,
  FirestoreDataConverter,
  Timestamp,
  FieldValue,
} from 'firebase/firestore';
import { getFirebaseFirestore } from './firebase';
import type { Campanha, Aluno, Doacao, Rifa, AuditoriaLog, Usuario } from '@/types';

type WithTimestamps<T> = Omit<T, 'id' | 'data' | 'dataSorteio' | 'timestamp' | 'vencedor'> & {
  data?: Date;
  dataSorteio?: Date;
  timestamp?: Date;
  vencedor?: Campanha['vencedor'];
};

type CampanhaVencedor = NonNullable<Campanha['vencedor']>;

const toDate = (value: unknown): Date => {
  if (value instanceof Date) return value;
  if (value && typeof value === 'object' && 'toDate' in (value as Timestamp)) {
    return (value as Timestamp).toDate();
  }
  return new Date(value as string);
};

const hasWinnerDate = (
  value: CampanhaVencedor | FieldValue | undefined,
): value is CampanhaVencedor => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.codigo === 'string' &&
    typeof record.alunoId === 'string' &&
    typeof record.alunoNome === 'string' &&
    typeof record.turmaNome === 'string' &&
    record.data instanceof Date
  );
};

const campanhaConverter: FirestoreDataConverter<Campanha> = {
  toFirestore(campanha) {
    const vencedor = campanha.vencedor as CampanhaVencedor | FieldValue | undefined;
    const baseData = {
      ...campanha,
      dataSorteio: campanha.dataSorteio,
    };

    if (!hasWinnerDate(vencedor)) {
      return {
        ...baseData,
        vencedor,
      };
    }

    const winnerData = vencedor;
    return {
      ...baseData,
      vencedor: { ...winnerData, data: winnerData.data },
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data() as WithTimestamps<Campanha>;
    return {
      id: snapshot.id,
      ...data,
      dataSorteio: toDate(data.dataSorteio!),
      vencedor: data.vencedor
        ? { ...data.vencedor, data: toDate(data.vencedor.data) }
        : undefined,
    } as Campanha;
  },
};

const alunoConverter: FirestoreDataConverter<Aluno> = {
  toFirestore(aluno) {
    return aluno;
  },
  fromFirestore(snapshot) {
    return { id: snapshot.id, ...(snapshot.data() as Omit<Aluno, 'id'>) };
  },
};

const doacaoConverter: FirestoreDataConverter<Doacao> = {
  toFirestore(doacao) {
    return {
      ...doacao,
      data: doacao.data,
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data() as WithTimestamps<Doacao>;
    return {
      id: snapshot.id,
      ...data,
      data: toDate(data.data!),
    } as Doacao;
  },
};

const rifaConverter: FirestoreDataConverter<Rifa> = {
  toFirestore(rifa) {
    return {
      ...rifa,
      data: rifa.data,
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data() as WithTimestamps<Rifa>;
    return {
      id: snapshot.id,
      ...data,
      data: toDate(data.data!),
    } as Rifa;
  },
};

const usuarioConverter: FirestoreDataConverter<Usuario> = {
  toFirestore(usuario) {
    return usuario;
  },
  fromFirestore(snapshot) {
    return { id: snapshot.id, ...(snapshot.data() as Omit<Usuario, 'id'>) };
  },
};

const auditoriaConverter: FirestoreDataConverter<AuditoriaLog> = {
  toFirestore(log) {
    return {
      ...log,
      timestamp: log.timestamp,
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data() as WithTimestamps<AuditoriaLog>;
    return {
      id: snapshot.id,
      ...data,
      timestamp: toDate(data.timestamp!),
    } as AuditoriaLog;
  },
};

export const campanhasCollection = () =>
  collection(getFirebaseFirestore(), 'campanhas').withConverter(campanhaConverter);
export const alunosCollection = () =>
  collection(getFirebaseFirestore(), 'alunos').withConverter(alunoConverter);
export const doacoesCollection = () =>
  collection(getFirebaseFirestore(), 'doacoes').withConverter(doacaoConverter);
export const rifasCollection = () =>
  collection(getFirebaseFirestore(), 'rifas').withConverter(rifaConverter);
export const usuariosCollection = () =>
  collection(getFirebaseFirestore(), 'usuarios').withConverter(usuarioConverter);
export const auditoriaCollection = () =>
  collection(getFirebaseFirestore(), 'auditoria').withConverter(auditoriaConverter);

export const activeCampaignQuery = () =>
  query(campanhasCollection(), where('status', '==', 'ativa'), limit(1));
export const campaignHistoryQuery = () =>
  query(campanhasCollection(), orderBy('dataSorteio', 'desc'));
