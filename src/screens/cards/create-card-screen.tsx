import React, { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { InputText } from '@components/input-text';
import { SaveButton } from '@components/save-button';
import { STATUS_IDLE, STATUS_LOADING, STATUS_ERROR, STATUS } from '@constants/statuses';
import { createCard } from '@services/create-card';
import { isStringEmpty } from '@utils/is-string-empty';
import { FormLayout } from '@components/form-layout';
import { Spacer } from '@components/spacer';
import {
  CARD_CREATE_SCREEN,
  CARD_CREATE_INPUT_VALUE,
  CARD_CREATE_INPUT_DESCRIPTION,
} from '@e2e/ids';
import { StackNavigationProp } from '@react-navigation/stack';
import { TopicsStackParamList } from '@stacks/topics-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { CARDS_CREATE_SCREEN } from '@constants/screens';

const BGWAPI = require("@utils/bgw")

type NavigationProps = StackNavigationProp<TopicsStackParamList, typeof CARDS_CREATE_SCREEN>;
type RouteProps = RouteProp<TopicsStackParamList, typeof CARDS_CREATE_SCREEN>;

export function CreateCardScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();
  const descriptionRef = useRef<TextInput>(null);
  const [status, setStatus] = useState<STATUS>(STATUS_IDLE);
  const [card, setCard] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const onAddPress = async () => {
      try {
        await createCard(route.params.topicId, card, description);
        navigation.goBack();
      } catch (error) {
        setStatus(STATUS_ERROR);
        setError(error instanceof Error ? error.message : 'An error occurred');
      }
    };

    const isDisabled = status === STATUS_LOADING || isStringEmpty(card);

    navigation.setOptions({
      title: 'Add a card',
      headerRight: () => {
        return <SaveButton disabled={isDisabled} onPress={onAddPress} status={status} />;
      },
    });
  });

  const onCardChange = (card: string) => {
    setCard(card);
  };

  const onDescriptionChange = (description: string): void => {
    setDescription(description);
  };

  const onCardSubmitEditing = () => {
  };

  const onSearch = () => {
    console.log("Searching for " + card);
    // Parse the card value as bible reference
    //var refText = card.trim()
    //refText = refText.replace(/\s+/g, '')
    //const regex = /(\d?)([A-Za-z]*)(\d*):(\d*)(-(\d*))?/
    let bgw = new BGWAPI.BibleGatewayAPI();
    bgw.search(card).then(( result: any) => {
      console.log("Verse: " + result.verse)
      
      // remove verse number and other annotations from the content
      /*
      var content = result.content;
      content = content.replace(/\d/g, '')
      content = content.replace(/\[[A-Za-z]\]/g, '')
      content = content.replace(/\([A-Za-z]\)/g, '')
      */
      console.log("Text " + result.content)

      if ( descriptionRef.current != undefined )
        descriptionRef.current.setNativeProps({text: result.content});
        setDescription(result.content)
    } );
    
  };


  return (
    <FormLayout status={status} error={error}>
      <View testID={CARD_CREATE_SCREEN}>
        <InputText
          label="Card"
          placeholder="Card"
          onChangeText={onCardChange}
          autoFocus={true}
          onSubmitEditing={onCardSubmitEditing}
          returnKeyType="next"
          testID={CARD_CREATE_INPUT_VALUE}
          showSearchIcon={true}
          onSearch = {onSearch}
        />
        <Spacer marginTop={10}>
          <InputText
            label="Description"
            placeholder="Write an optional card's description"
            onChangeText={onDescriptionChange}
            multiline={true}
            ref={descriptionRef}
            testID={CARD_CREATE_INPUT_DESCRIPTION}
            showSearchIcon={false}
          />
        </Spacer>
      </View>
    </FormLayout>
  );
}
