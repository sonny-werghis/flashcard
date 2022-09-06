import firestore from '@react-native-firebase/firestore';
import { CARDS, TOPICS } from '@constants/database';
import { handleError } from '@services/handle-error';
import { Topic } from '@models/topic';

export async function deleteTopic(topic: Topic) {
  try {
    const cards = firestore().collection(CARDS);
    for (const cardId of topic.cards) {
      await cards.doc(cardId).delete();
    }
    await firestore().collection(TOPICS).doc(topic.id).delete();
  } catch (error) {
    handleError(error);
  }
}
