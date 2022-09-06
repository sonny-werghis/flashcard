import { firestore } from 'firebase-admin';
import { db, admin } from '@e2e/database/db';
import { E2E_COLLECTION_TOPICS, E2E_COLLECTION_CARDS } from '@e2e/constants';

export async function createCard(
  topicId: string,
  value: string,
  description: string | null = null
) {
  const topic = firestore().collection(E2E_COLLECTION_TOPICS).doc(topicId);

  const card = await db.collection(E2E_COLLECTION_CARDS).add({
    value,
    description,
    topic: topicId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await topic.update({
    cards: firestore.FieldValue.arrayUnion(card.id),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });

  return card;
}
