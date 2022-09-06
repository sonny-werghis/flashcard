/**
 * Add the fields "createdAt" and "updatedAt" to topics and cards.
 */
import path from 'path';
import { firestore } from 'firebase-admin';
import { CollectionReference } from '@google-cloud/firestore';

async function addTimestampToCollectionDocuments(collection: CollectionReference) {
  const docs = await collection.listDocuments();
  for (const doc of docs) {
    const snap = await doc.get();
    const data = snap.data();
    if (data !== undefined) {
      if (data.createdAt === undefined) {
        console.log(`Adding timestamp to doc ${doc.id}`);
        await doc.update({
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      }

      if (data.updatedAt === undefined) {
        console.log(`Adding timestamp to doc ${doc.id}`);
        await doc.update({
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      }
    }
  }
}

export async function run() {
  const fs = new firestore.Firestore({
    projectId: process.env.PROJECT_ID,
    keyFilename: path.join('migrations', 'serviceAccountKey.json'),
  });

  const collectionsNames = [process.env.COLLECTION_TOPICS as string, process.env.COLLECTION_CARDS as string];
  for (const collectionName of collectionsNames) {
    const collection = fs.collection(collectionName);
    await addTimestampToCollectionDocuments(collection);
  }
}
