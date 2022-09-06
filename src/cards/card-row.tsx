import React, { useRef } from 'react';
import { Alert, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { CARDS_EDIT_SCREEN, CARDS_SCREEN } from '@constants/screens';
import { Text } from '@components/text';
import { Spacer } from '@components/spacer';
import { isStringEmpty } from '@utils/is-string-empty';
import { deleteCard } from '@services/delete-card';
import { SwipeAction } from '@components/swipe-action';
import { SwipeActions } from '@components/swipe-actions';
import { ListRow } from '@components/list-row';
import { INFO, DANGER } from '@constants/colors';
import {
  CARDS_ROW_EDIT,
  CARDS_ROW_DELETE,
  CARDS_ROW_VALUE,
  CARDS_ROW_DESCRIPTION,
} from '@e2e/ids';
import { PARAM_CARD } from '@constants/navigation-parameters';
import { Card } from "@models/card";
import { StackNavigationProp } from '@react-navigation/stack';
import { TopicsStackParamList } from '@stacks/topics-stack';
import { useNavigation } from '@react-navigation/native';

type NavigationProps = StackNavigationProp<TopicsStackParamList, typeof CARDS_SCREEN>;

type Props = {
  card: Card;
  testID: string;
};

export function CardRow({ card, testID }: Props) {
  const navigation = useNavigation<NavigationProps>();
  const swipeableRef = useRef<Swipeable>(null);

  const closeSwipeable = () => {
    swipeableRef.current?.close();
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation) => {
    const onEditPress = () => {
      closeSwipeable();
      navigation.push(CARDS_EDIT_SCREEN, { [PARAM_CARD]: card });
    };

    const handleDeletePress = () => {
      Alert.alert(
        'Delete card',
        'Do you want to delete this card?',
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
                await deleteCard(card);
              } catch (error) {
                let errorMessage: string;
                if (error instanceof Error) {
                  errorMessage = error.message;
                } else {
                  errorMessage = 'An error occurred while deleting the card.';
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

    return (
      <SwipeActions width={192}>
        <SwipeAction
          progress={progress}
          dragX={128}
          onPress={onEditPress}
          text="Edit"
          backgroundColor={INFO}
          testID={CARDS_ROW_EDIT(card.id)}
        />
        <SwipeAction
          progress={progress}
          dragX={64}
          onPress={handleDeletePress}
          text="Delete"
          backgroundColor={DANGER}
          testID={CARDS_ROW_DELETE(card.id)}
        />
      </SwipeActions>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} ref={swipeableRef}>
      <ListRow testID={testID}>
        <>
          <Text fontSize={20} testID={CARDS_ROW_VALUE(card.id)}>
            {card.value}
          </Text>
          {!isStringEmpty(card.description) && (
            <Spacer marginTop={5}>
              {card.description !== undefined && (
                <Text color="primary075" testID={CARDS_ROW_DESCRIPTION}>
                  {card.description}
                </Text>
              )}
            </Spacer>
          )}
        </>
      </ListRow>
    </Swipeable>
  );
}
