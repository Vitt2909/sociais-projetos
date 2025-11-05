import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { generateRifasHandler } from './generateRifas';
import { drawWinnerHandler } from './drawWinner';

if (!admin.apps.length) {
  admin.initializeApp();
}

export const generateRifas = functions.region('southamerica-east1').https.onCall(generateRifasHandler);
export const drawWinner = functions.region('southamerica-east1').https.onCall(drawWinnerHandler);
