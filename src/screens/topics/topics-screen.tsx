import React, { useEffect, useRef, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { TOPICS } from '@constants/database';
import { TOPICS_CREATE_SCREEN, TOPICS_SCREEN } from '@constants/screens';
import { TopicRow } from '@topics/topic-row';
import { documentSnapshotToTopic, Topic } from '@models/topic';
import { FiltrableList } from '@components/list/filtrable-list';
import { TOPICS_SCREEN_ID, TOPICS_ROW } from '@e2e/ids';
import { FilterOpenButton } from '@components/filter-open-button';
import { StackNavigationProp } from '@react-navigation/stack';
import { TopicsStackParamList } from '@stacks/topics-stack';
import { useNavigation } from '@react-navigation/native';

type NavigationProps = StackNavigationProp<TopicsStackParamList, typeof TOPICS_SCREEN>;

function filterTopics(filter: string, topic: Topic) {
  return topic.name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
}

function renderTopic({ item }: { item: Topic }) {
  return <TopicRow topic={item} testID={TOPICS_ROW(item.id)} />;
}

export function TopicsScreen() {
  const navigation = useNavigation<NavigationProps>();
  const [hasFilterEnabled, setHasFilterEnabled] = useState(false);
  const query = useRef<FirebaseFirestoreTypes.Query>(firestore().collection(TOPICS).orderBy('updatedAt', 'desc'));

  useEffect(() => {
    const onOpenFilterPress = () => {
      setHasFilterEnabled(true);
      navigation.setOptions({
        headerShown: false,
      });
    };

    navigation.setOptions({
      title: 'Topics',
      headerRight: () => <FilterOpenButton onPress={onOpenFilterPress} />,
    });
  }, [navigation]);

  const onAddTopicPress = () => {
    navigation.push(TOPICS_CREATE_SCREEN);
  };

  const onCloseFilter = () => {
    setHasFilterEnabled(false);
    navigation.setOptions({
      headerShown: true,
    });
  };

  return (
    <FiltrableList<Topic>
      query={query.current}
      renderItem={renderTopic}
      documentSnapshotToEntity={documentSnapshotToTopic}
      onAddPress={onAddTopicPress}
      emptyListMessage="Press the add button to add a new topic."
      testID={TOPICS_SCREEN_ID}
      filterEntities={filterTopics}
      onCloseFilter={onCloseFilter}
      hasFilterEnabled={hasFilterEnabled}
    />
  );
}
