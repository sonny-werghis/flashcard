import React, { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { InputText } from '@components/input-text';
import { SaveButton } from '@components/save-button';
import { STATUS_IDLE, STATUS_LOADING, STATUS_ERROR, STATUS } from '@constants/statuses';
import { isStringEmpty } from '@utils/is-string-empty';
import { updateCard } from '@services/update-card';
import { FormLayout } from '@components/form-layout';
import { Spacer } from '@components/spacer';
import {
  CARD_EDIT_SCREEN,
  CARD_EDIT_INPUT_VALUE,
  CARD_EDIT_INPUT_DESCRIPTION,
} from '@e2e/ids';
import { StackNavigationProp } from '@react-navigation/stack';
import { TopicsStackParamList } from '@stacks/topics-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { CARDS_EDIT_SCREEN } from '@constants/screens';
import { Card } from "@models/card";

type NavigationProps = StackNavigationProp<TopicsStackParamList, typeof CARDS_EDIT_SCREEN>;
type RouteProps = RouteProp<TopicsStackParamList, typeof CARDS_EDIT_SCREEN>;

export function EditCardScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();
  const descriptionRef = useRef<TextInput>(null);
  const [status, setStatus] = useState<STATUS>(STATUS_IDLE);
  const [error, setError] = useState<string | undefined>(undefined);
  const [card, setCard] = useState<Card>(route.params.card);

  useEffect(() => {
    const onSavePress = async () => {
      try {
        setStatus(STATUS_LOADING);
        await updateCard(card);
        navigation.goBack();
      } catch (error) {
        setStatus(STATUS_ERROR);
        setError(error instanceof Error ? error.message : 'An error occurred');
      }
    };

    navigation.setOptions({
      headerRight: () => {
        const isDisabled = status === STATUS_LOADING || isStringEmpty(card.value);

        return <SaveButton disabled={isDisabled} onPress={onSavePress} status={status} />;
      },
    });
  });

  const onCardChange = (cardValue: string) => {
    setCard({
      ...card,
      value: cardValue,
    });
  };


  const onDescriptionChange = (description: string): void => {
    setCard({
      ...card,
      description,
    });
  };

  const onCardSubmitEditing = () => {
  };


  return (
    <FormLayout status={status} error={error}>
      <View testID={CARD_EDIT_SCREEN}>
        <InputText
          label="Card"
          placeholder="Card"
          onChangeText={onCardChange}
          autoFocus={true}
          onSubmitEditing={onCardSubmitEditing}
          returnKeyType="next"
          value={card.value}
          testID={CARD_EDIT_INPUT_VALUE}
        />
        <Spacer marginTop={10}>
          <InputText
            label="Description"
            placeholder="Write an optional card's description"
            onChangeText={onDescriptionChange}
            multiline={true}
            ref={descriptionRef}
            value={card.description}
            testID={CARD_EDIT_INPUT_DESCRIPTION}
          />
        </Spacer>
      </View>
    </FormLayout>
  );
}
