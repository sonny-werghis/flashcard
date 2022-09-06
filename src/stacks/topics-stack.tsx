import React from 'react';
import { TopicsScreen } from '@screens/topics/topics-screen';
import { CreateTopicScreen } from '@screens/topics/create-topic-screen';
import { EditTopicScreen } from '@screens/topics/edit-topic-screen';
import { CardsScreen } from '@screens/cards/cards-screen';
import { CreateCardScreen } from '@screens/cards/create-card-screen';
import { EditCardScreen } from '@screens/cards/edit-card-screen';
import {
  TOPICS_SCREEN,
  TOPICS_CREATE_SCREEN,
  TOPICS_EDIT_SCREEN,
  CARDS_SCREEN,
  CARDS_CREATE_SCREEN,
  CARDS_EDIT_SCREEN,
} from '@constants/screens';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@theme/use-theme';
import {
  PARAM_SCREEN_TITLE,
  PARAM_TOPIC,
  PARAM_TOPIC_ID,
  PARAM_CARD,
} from '@constants/navigation-parameters';
import { Topic } from '@models/topic';
import { Card } from "@models/card";

export type TopicsStackParamList = {
  [TOPICS_SCREEN]: undefined;
  [TOPICS_CREATE_SCREEN]: undefined;
  [TOPICS_EDIT_SCREEN]: { [PARAM_TOPIC]: Topic };
  [CARDS_SCREEN]: { [PARAM_SCREEN_TITLE]: string; [PARAM_TOPIC]: Topic };
  [CARDS_CREATE_SCREEN]: { [PARAM_TOPIC_ID]: string };
  [CARDS_EDIT_SCREEN]: { [PARAM_CARD]: Card };
};

const Stack = createStackNavigator<TopicsStackParamList>();

export function TopicsStack() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={TOPICS_SCREEN}
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: theme.primary100,
        },
        headerTintColor: theme.primary025,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name={TOPICS_SCREEN} component={TopicsScreen} />
      <Stack.Screen
        name={TOPICS_CREATE_SCREEN}
        component={CreateTopicScreen}
        options={{
          title: 'Add a topic',
        }}
      />
      <Stack.Screen
        name={TOPICS_EDIT_SCREEN}
        component={EditTopicScreen}
        options={{
          title: 'Edit a topic',
        }}
      />
      <Stack.Screen name={CARDS_SCREEN} component={CardsScreen} />
      <Stack.Screen name={CARDS_CREATE_SCREEN} component={CreateCardScreen} />
      <Stack.Screen
        name={CARDS_EDIT_SCREEN}
        component={EditCardScreen}
        options={{
          title: 'Edit a card',
        }}
      />
    </Stack.Navigator>
  );
}
