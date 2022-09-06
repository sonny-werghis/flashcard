import { db, admin } from '@e2e/database/db';
import { E2E_COLLECTION_TOPICS } from '@e2e/constants';

export async function createTopic(name: string, cards = []) {
  return await db.collection(E2E_COLLECTION_TOPICS).add({
    name,
    cards,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}
