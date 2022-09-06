import { Entity } from '@models/entity';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface Topic extends Entity {
  name: string;
  cards: string[];
}

export function documentSnapshotToTopic(snap: FirebaseFirestoreTypes.DocumentSnapshot) {
  const topic = snap.data() as Topic;
  if (snap.id === null) {
    throw new Error('topic snapshot document id not found');
  }
  topic.id = snap.id;

  return topic;
}
