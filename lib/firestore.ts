import {
  collection,
  query,
  where,
  orderBy,
  limit,
  FirestoreDataConverter,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from './firebase';
import type { Campanha, Aluno, Doacao, Rifa, AuditoriaLog, Usuario } from '@/types';

type WithTimestamps<T> = Omit<T, 'data' | 'dataSorteio' | 'timestamp' | 'vencedor'> & {
  data?: Date;
  dataSorteio?: Date;
  timestamp?: Date;
  vencedor?: Campanha['vencedor'];
};

const toDate = (value: unknown): Date => {
  if (value instanceof Date) return value;
  if (value && typeof value === 'object' && 'toDate' in (value as Timestamp)) {
    return (value as Timestamp).toDate();
  }
  return new Date(value as string);
};

const campanhaConverter: FirestoreDataConverter<Campanha> = {
  toFirestore(campanha) {
    return {
      ...campanha,
      dataSorteio: campanha.dataSorteio,
      vencedor: campanha.vencedor
        ? { ...campanha.vencedor, data: campanha.vencedor.data }
        : undefined,
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
    return { id: snapshot.id, ...(snapshot.data() as Aluno) };
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
    return { id: snapshot.id, ...(snapshot.data() as Usuario) };
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

export const campanhasCollection = collection(firestore, 'campanhas').withConverter(campanhaConverter);
export const alunosCollection = collection(firestore, 'alunos').withConverter(alunoConverter);
export const doacoesCollection = collection(firestore, 'doacoes').withConverter(doacaoConverter);
export const rifasCollection = collection(firestore, 'rifas').withConverter(rifaConverter);
export const usuariosCollection = collection(firestore, 'usuarios').withConverter(usuarioConverter);
export const auditoriaCollection = collection(firestore, 'auditoria').withConverter(auditoriaConverter);

export const activeCampaignQuery = query(campanhasCollection, where('status', '==', 'ativa'), limit(1));
export const campaignHistoryQuery = query(campanhasCollection, orderBy('dataSorteio', 'desc'));
