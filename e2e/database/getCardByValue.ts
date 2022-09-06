import { db } from '@e2e/database/db';
import { E2E_COLLECTION_CARDS } from '@e2e/constants';
import { Card } from "@models/card";

export async function getCardByValue(value: string) {
  const doc = await db.collection(E2E_COLLECTION_CARDS).where('value', '==', value).get();

  const card = doc.docs[0].data() as Card;
  card.id = doc.docs[0].id;

  return card;
}
