import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { gerarCodigoRifa, pesoParaRifas } from './utils/rifaRules';

const db = admin.firestore();

export const generateRifasHandler = async (data: any, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autenticação obrigatória.');
  }

  const { campanhaId, alunoId, pesoKg, data: dataDoacao, registradoPor } = data ?? {};

  if (!campanhaId || !alunoId || typeof pesoKg === 'undefined') {
    throw new functions.https.HttpsError('invalid-argument', 'Parâmetros obrigatórios não informados.');
  }

  const pesoNumber = Number(pesoKg);
  if (Number.isNaN(pesoNumber)) {
    throw new functions.https.HttpsError('invalid-argument', 'Peso inválido.');
  }

  let rifasQuantidade: number;
  try {
    rifasQuantidade = pesoParaRifas(pesoNumber);
  } catch (err) {
    throw new functions.https.HttpsError('failed-precondition', (err as Error).message);
  }

  const campanhaRef = db.collection('campanhas').doc(campanhaId);
  const alunoRef = db.collection('alunos').doc(alunoId);
  const doacoesRef = db.collection('doacoes').doc();
  const rifasRef = db.collection('rifas');
  const auditoriaRef = db.collection('auditoria').doc();

  const resultado = await db.runTransaction(async (transaction) => {
    const campanhaSnap = await transaction.get(campanhaRef);
    if (!campanhaSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Campanha não localizada.');
    }
    const campanhaData = campanhaSnap.data() as any;
    if (campanhaData.status !== 'ativa') {
      throw new functions.https.HttpsError('failed-precondition', 'Campanha não está ativa.');
    }

    const alunoSnap = await transaction.get(alunoRef);
    if (!alunoSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Aluno não localizado.');
    }
    const alunoData = alunoSnap.data() as any;

    const lastSerial: number = campanhaData.lastSerial ?? 0;
    const startSerial = lastSerial + 1;
    const endSerial = lastSerial + rifasQuantidade;
    const anoCampanha = new Date(campanhaData.dataSorteio.toDate ? campanhaData.dataSorteio.toDate() : campanhaData.dataSorteio).getFullYear();

    const codigos: string[] = [];
    for (let serial = startSerial; serial <= endSerial; serial += 1) {
      const codigo = gerarCodigoRifa(anoCampanha, serial);
      codigos.push(codigo);
      const novaRifaRef = rifasRef.doc();
      transaction.set(novaRifaRef, {
        codigo,
        campanhaId,
        alunoId,
        alunoNome: alunoData.nome,
        turmaId: alunoData.turmaId,
        turmaNome: alunoData.turmaNome,
        data: admin.firestore.Timestamp.now(),
      });
    }

    const donationDate = dataDoacao ? new Date(dataDoacao) : new Date();

    transaction.set(doacoesRef, {
      campanhaId,
      alunoId,
      alunoNome: alunoData.nome,
      turmaId: alunoData.turmaId,
      turmaNome: alunoData.turmaNome,
      pesoKg: pesoNumber,
      rifasGeradas: codigos,
      data: admin.firestore.Timestamp.fromDate(donationDate),
      registradoPor: registradoPor ?? { userId: context.auth.uid, nome: context.auth.token.name ?? 'Usuário' },
    });

    const countersUpdate: Record<string, any> = {
      'counters.totalKg': admin.firestore.FieldValue.increment(pesoNumber),
      'counters.totalRifas': admin.firestore.FieldValue.increment(rifasQuantidade),
      lastSerial: endSerial,
    };

    const alunoExisteSnapshot = await transaction.get(
      db
        .collection('doacoes')
        .where('campanhaId', '==', campanhaId)
        .where('alunoId', '==', alunoId)
        .limit(1)
    );
    if (alunoExisteSnapshot.empty) {
      countersUpdate['counters.totalAlunos'] = admin.firestore.FieldValue.increment(1);
    }

    const turmaExisteSnapshot = await transaction.get(
      db
        .collection('doacoes')
        .where('campanhaId', '==', campanhaId)
        .where('turmaId', '==', alunoData.turmaId)
        .limit(1)
    );
    if (turmaExisteSnapshot.empty) {
      countersUpdate['counters.totalTurmas'] = admin.firestore.FieldValue.increment(1);
    }

    transaction.update(campanhaRef, countersUpdate);

    transaction.set(auditoriaRef, {
      who: {
        userId: context.auth.uid,
        nome: registradoPor?.nome ?? context.auth.token.name ?? 'Usuário',
      },
      what: 'register_donation',
      entity: campanhaId,
      after: {
        doacaoId: doacoesRef.id,
        aluno: alunoData.nome,
        turma: alunoData.turmaNome,
        pesoKg: pesoNumber,
        rifasGeradas: codigos,
      },
      timestamp: admin.firestore.Timestamp.now(),
    });

    return { codigos };
  });

  return resultado;
};
