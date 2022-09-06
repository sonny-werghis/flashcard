import { isStringEmpty } from '@utils/is-string-empty';
import { CARDS } from '@constants/database';
import firestore from '@react-native-firebase/firestore';
import { handleError } from '@services/handle-error';
import { Card } from "@models/card";

export async function updateCard(card: Card) {
  try {
    const { value } = card;
    if (isStringEmpty(value)) {
      throw new Error('Card is required.');
    }


    const cards = firestore().collection(CARDS);
    await cards.doc(card.id).update({
      value,
      description: card.description,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    handleError(error);
  }
}
