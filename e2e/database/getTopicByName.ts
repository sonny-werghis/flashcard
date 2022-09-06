import { db } from '@e2e/database/db';
import { E2E_COLLECTION_TOPICS } from '@e2e/constants';
import { Topic } from '@models/topic';

export async function getTopicByName(name: string) {
  const doc = await db.collection(E2E_COLLECTION_TOPICS).where('name', '==', name).get();

  const topic = doc.docs[0].data() as Topic;
  topic.id = doc.docs[0].id;

  return topic;
}
