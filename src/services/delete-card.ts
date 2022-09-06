import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { TOPICS, CARDS } from '@constants/database';
import { handleError } from '@services/handle-error';
import { Card } from "@models/card";

export async function deleteCard(card: Card) {
  try {
    const snapshot: FirebaseFirestoreTypes.QuerySnapshot = await firestore()
      .collection(TOPICS)
      .where('cards', 'array-contains', card.id)
      .get();

    for (const topic of snapshot.docs) {
      if (topic.id !== null) {
        await firestore()
          .collection(TOPICS)
          .doc(topic.id)
          .update({
            cards: firestore.FieldValue.arrayRemove(card.id),
          });
      }
    }

    await firestore().collection(CARDS).doc(card.id).delete();
  } catch (error) {
    handleError(error);
  }
}
