import firestore from '@react-native-firebase/firestore';
import { CARDS, TOPICS } from '@constants/database';
import { isStringEmpty } from '@utils/is-string-empty';
import { handleError } from '@services/handle-error';

export async function createCard(topicId: string, value: string, description: string) {
  try {
    if (isStringEmpty(topicId)) {
      throw new Error('A topic ID is required.');
    }

    if (isStringEmpty(value)) {
      throw new Error('A value is required.');
    }

    const cards = firestore().collection(CARDS);
    const snap = await cards.where('topic', '==', topicId).where('value', '==', value).get();

    if (!snap.empty) {
      throw new Error('This card already exists in this topic.');
    }

    const card = await cards.add({
      value,
      description,
      topic: topicId,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    const topic = firestore().collection(TOPICS).doc(topicId);

    await topic.update({
      cards: firestore.FieldValue.arrayUnion(card.id),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    handleError(error);
  }
}
