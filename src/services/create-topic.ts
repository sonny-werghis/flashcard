import firestore from '@react-native-firebase/firestore';
import { TOPICS } from '@constants/database';
import { isStringEmpty } from '@utils/is-string-empty';
import { handleError } from '@services/handle-error';

export async function createTopic(name: string) {
  try {
    if (isStringEmpty(name)) {
      throw new Error('A name is required.');
    }

    const topics = firestore().collection(TOPICS);
    const snap = await topics.where('name', '==', name).get();
    if (!snap.empty) {
      throw new Error('This topic already exists.');
    }

    await topics.add({
      name,
      cards: [],
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    handleError(error);
  }
}
