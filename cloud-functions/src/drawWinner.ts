import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

export const drawWinnerHandler = async (data: any, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autenticação obrigatória.');
  }

  const role = context.auth.token?.role as string | undefined;
  if (role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Somente administradores podem realizar o sorteio.');
  }

  const { campanhaId } = data ?? {};
  if (!campanhaId) {
    throw new functions.https.HttpsError('invalid-argument', 'Informe o ID da campanha.');
  }

  const campanhaRef = db.collection('campanhas').doc(campanhaId);
  const campanhaSnap = await campanhaRef.get();
  if (!campanhaSnap.exists) {
    throw new functions.https.HttpsError('not-found', 'Campanha não localizada.');
  }
  const campanhaData = campanhaSnap.data() as any;
  if (campanhaData.status !== 'ativa') {
    throw new functions.https.HttpsError('failed-precondition', 'A campanha já foi encerrada.');
  }

  const totalRifas: number = campanhaData.counters?.totalRifas ?? 0;
  if (!totalRifas || totalRifas <= 0) {
    throw new functions.https.HttpsError('failed-precondition', 'Nenhuma rifa disponível para sorteio.');
  }

  const randomIndex = Math.floor(Math.random() * totalRifas);
  const rifasSnapshot = await db
    .collection('rifas')
    .where('campanhaId', '==', campanhaId)
    .orderBy('codigo')
    .offset(randomIndex)
    .limit(1)
    .get();

  if (rifasSnapshot.empty) {
    throw new functions.https.HttpsError('internal', 'Não foi possível localizar a rifa sorteada.');
  }

  const rifaDoc = rifasSnapshot.docs[0];
  const rifaData = rifaDoc.data();

  await db.runTransaction(async (transaction) => {
    const latestSnapshot = await transaction.get(campanhaRef);
    const latestData = latestSnapshot.data() as any;
    if (!latestData || latestData.status !== 'ativa') {
      throw new functions.https.HttpsError('failed-precondition', 'A campanha já foi encerrada.');
    }

    transaction.update(campanhaRef, {
      status: 'encerrada',
      vencedor: {
        codigo: rifaData.codigo,
        alunoId: rifaData.alunoId,
        alunoNome: rifaData.alunoNome,
        turmaNome: rifaData.turmaNome,
        data: admin.firestore.Timestamp.now(),
      },
    });

    transaction.set(db.collection('auditoria').doc(), {
      who: { userId: context.auth.uid, nome: context.auth.token.name ?? 'Administrador' },
      what: 'draw_winner',
      entity: campanhaId,
      after: {
        codigo: rifaData.codigo,
        aluno: rifaData.alunoNome,
        turma: rifaData.turmaNome,
      },
      timestamp: admin.firestore.Timestamp.now(),
    });
  });

  return {
    vencedor: {
      codigo: rifaData.codigo,
      alunoId: rifaData.alunoId,
      alunoNome: rifaData.alunoNome,
      turmaNome: rifaData.turmaNome,
      data: new Date().toISOString(),
    },
  };
};
