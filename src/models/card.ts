import { Entity } from '@models/entity';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface Card extends Entity {
  value: string;
  description: string;
  topic: string;
}

export function documentSnapshotToCard(snap: FirebaseFirestoreTypes.DocumentSnapshot) {
  const card = snap.data() as Card;
  if (snap.id === null) {
    throw new Error('card snapshot document id not found');
  }
  card.id = snap.id;

  return card;
}
