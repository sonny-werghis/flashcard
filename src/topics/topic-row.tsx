import React, { useRef } from 'react';
import { Alert, StyleSheet, View, ViewStyle, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { CARDS_SCREEN, TOPICS_EDIT_SCREEN, TOPICS_SCREEN } from '@constants/screens';
import { ClockIcon } from '@components/svg/clock-icon';
import { Text } from '@components/text';
import { Spacer } from '@components/spacer';
import { deleteTopic } from '@services/delete-topic';
import { SwipeAction } from '@components/swipe-action';
import { SwipeActions } from '@components/swipe-actions';
import { ListRow } from '@components/list-row';
import { INFO, DANGER } from '@constants/colors';
import {
  TOPICS_ROW_EDIT,
  TOPICS_ROW_DELETE,
  TOPICS_ROW_NAME,
  TOPICS_ROW_CARDS_COUNT,
  TOPICS_ROW_UPDATED_AT,
} from '@e2e/ids';
import { PARAM_TOPIC, PARAM_SCREEN_TITLE } from '@constants/navigation-parameters';
import { Topic } from '@models/topic';
import { StackNavigationProp } from '@react-navigation/stack';
import { TopicsStackParamList } from '@stacks/topics-stack';
import { useNavigation } from '@react-navigation/native';

type NavigationProps = StackNavigationProp<TopicsStackParamList, typeof TOPICS_SCREEN>;

type Props = {
  topic: Topic;
  testID: string;
};

export function TopicRow({ topic, testID }: Props) {
  const navigation = useNavigation<NavigationProps>();
  const swipeableRef = useRef<Swipeable>(null);

  const closeSwipeable = () => {
    swipeableRef.current?.close();
  };

  const onRowPress = () => {
    closeSwipeable();
    navigation.push(CARDS_SCREEN, {
      [PARAM_TOPIC]: topic,
      [PARAM_SCREEN_TITLE]: topic.name,
    });
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Delete topic',
      'Do you want to delete this topic?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: closeSwipeable,
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteTopic(topic);
            } catch (error) {
              let errorMessage: string;
              if (error instanceof Error) {
                errorMessage = error.message;
              } else {
                errorMessage = 'An error occurred while deleting the topic';
              }
              Alert.alert('Error', errorMessage);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation) => {
    const onEditPress = () => {
      closeSwipeable();
      navigation.push(TOPICS_EDIT_SCREEN, {
        [PARAM_TOPIC]: topic,
      });
    };

    return (
      <SwipeActions width={192}>
        <SwipeAction
          progress={progress}
          dragX={128}
          onPress={onEditPress}
          text="Edit"
          backgroundColor={INFO}
          testID={TOPICS_ROW_EDIT(topic.id)}
        />
        <SwipeAction
          progress={progress}
          dragX={64}
          onPress={handleDeletePress}
          text="Delete"
          backgroundColor={DANGER}
          testID={TOPICS_ROW_DELETE(topic.id)}
        />
      </SwipeActions>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} ref={swipeableRef}>
      <ListRow onPress={onRowPress} testID={testID}>
        <>
          <Text fontSize={20} testID={TOPICS_ROW_NAME(topic.id)}>
            {topic.name}
          </Text>
          <View style={styles.details}>
            <Text fontSize={18} color="primary050" testID={TOPICS_ROW_CARDS_COUNT}>
              {`${topic.cards.length} card(s)`}
            </Text>
            {topic.updatedAt !== null && (
              <View style={styles.updatedAt} testID={TOPICS_ROW_UPDATED_AT}>
                <ClockIcon />
                <Spacer marginLeft={5}>
                  <Text fontSize={16} color="primary050">
                    {topic.updatedAt.toDate().toLocaleDateString()}
                  </Text>
                </Spacer>
              </View>
            )}
          </View>
        </>
      </ListRow>
    </Swipeable>
  );
}

type Style = {
  details: ViewStyle;
  updatedAt: ViewStyle;
};

const styles = StyleSheet.create<Style>({
  details: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  updatedAt: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
