import React, { useEffect, useRef, useState } from 'react';
import { InputText } from '@components/input-text';
import { createTopic } from '@services/create-topic';
import { STATUS_IDLE, STATUS_LOADING, STATUS_ERROR, STATUS } from '@constants/statuses';
import { SaveButton } from '@components/save-button';
import { isStringEmpty } from '@utils/is-string-empty';
import { FormLayout } from '@components/form-layout';
import { TextInput, View } from 'react-native';
import { TOPIC_CREATE_INPUT_NAME, TOPIC_CREATE_SCREEN_ID } from '@e2e/ids';
import { StackNavigationProp } from '@react-navigation/stack';
import { TopicsStackParamList } from '@stacks/topics-stack';
import { useNavigation } from '@react-navigation/native';
import { TOPICS_CREATE_SCREEN } from '@constants/screens';

type NavigationProps = StackNavigationProp<TopicsStackParamList, typeof TOPICS_CREATE_SCREEN>;

export function CreateTopicScreen() {
  const navigation = useNavigation<NavigationProps>();
  const inputRef = useRef<TextInput>(null);
  const [status, setStatus] = useState<STATUS>(STATUS_IDLE);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const onSavePress = async () => {
    try {
      setStatus(STATUS_LOADING);
      await createTopic(name);
      navigation.goBack();
    } catch (error) {
      setStatus(STATUS_ERROR);
      setError(error instanceof Error ? error.message : 'An error occurred.');
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const isDisabled = status === STATUS_LOADING || isStringEmpty(name);

        return <SaveButton onPress={onSavePress} disabled={isDisabled} status={status} />;
      },
    });
  });

  const onNameChange = (name: string) => {
    setName(name);
  };

  return (
    <FormLayout status={status} error={error}>
      <View testID={TOPIC_CREATE_SCREEN_ID}>
        <InputText
          ref={inputRef}
          label="Name"
          onChangeText={onNameChange}
          onSubmitEditing={onSavePress}
          returnKeyType="send"
          maxLength={40}
          autoFocus={true}
          placeholder="Topic's name"
          testID={TOPIC_CREATE_INPUT_NAME}
        />
      </View>
    </FormLayout>
  );
}
