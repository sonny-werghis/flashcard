import { isStringEmpty } from '@utils/is-string-empty';
import firestore from '@react-native-firebase/firestore';
import { TOPICS } from '@constants/database';
import { handleError } from '@services/handle-error';
import { Topic } from '@models/topic';

export async function updateTopic(topic: Topic) {
  try {
    const { name } = topic;
    if (isStringEmpty(name)) {
      throw new Error('A name is required.');
    }

    const topics = firestore().collection(TOPICS);
    const snap = await topics.where('name', '==', name).get();
    if (!snap.empty) {
      throw new Error('This topic already exists.');
    }

    await topics.doc(topic.id).update({
      name,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    handleError(error);
  }
}
