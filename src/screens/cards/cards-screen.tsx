import React, { useEffect, useRef, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { CARDS } from '@constants/database';
import { CARDS_CREATE_SCREEN, CARDS_SCREEN } from '@constants/screens';
import { documentSnapshotToCard } from '@models/card';
import { Card } from "@models/card";
import { CardRow } from '@cards/card-row';
import { FiltrableList } from '@components/list/filtrable-list';
import { CARDS_ROW, CARDS_SCREEN as CARDS_SCREEN_E2E } from '@e2e/ids';
import { FilterOpenButton } from '@components/filter-open-button';
import { PARAM_TOPIC, PARAM_SCREEN_TITLE, PARAM_TOPIC_ID } from '@constants/navigation-parameters';
import { StackNavigationProp } from '@react-navigation/stack';
import { TopicsStackParamList } from '@stacks/topics-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

function renderCard({ item }: { item: Card }) {
  return <CardRow card={item} testID={CARDS_ROW(item.id)} />;
}

function filterCards(filter: string, card: Card) {
  return (
    card.value.toLowerCase().indexOf(filter.toLowerCase()) > -1
  );
}

type NavigationProps = StackNavigationProp<TopicsStackParamList, typeof CARDS_SCREEN>;
type RouteProps = RouteProp<TopicsStackParamList, typeof CARDS_SCREEN>;

export function CardsScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();
  const [hasFilterEnabled, setHasFilterEnabled] = useState(false);
  const query = useRef<FirebaseFirestoreTypes.Query>(
    firestore().collection(CARDS).where('topic', '==', route.params[PARAM_TOPIC].id)
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const onOpenFilterPress = () => {
          setHasFilterEnabled(true);
          navigation.setOptions({
            headerShown: false,
          });
        };

        return <FilterOpenButton onPress={onOpenFilterPress} />;
      },
      title: route.params[PARAM_SCREEN_TITLE],
    });
  }, [navigation, route.params]);

  const onCloseFilter = () => {
    setHasFilterEnabled(false);
    navigation.setOptions({
      headerShown: true,
    });
  };

  const onAddCardPress = () => {
    navigation.push(CARDS_CREATE_SCREEN, {
      [PARAM_TOPIC_ID]: route.params.topic.id,
    });
  };

  return (
    <FiltrableList<Card>
      query={query.current}
      renderItem={renderCard}
      documentSnapshotToEntity={documentSnapshotToCard}
      onAddPress={onAddCardPress}
      emptyListMessage="Press the add button to add a new card."
      testID={CARDS_SCREEN_E2E}
      filterEntities={filterCards}
      hasFilterEnabled={hasFilterEnabled}
      onCloseFilter={onCloseFilter}
    />
  );
}
