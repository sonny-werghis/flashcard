import React, { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { InputText } from '@components/input-text';
import { SaveButton } from '@components/save-button';
import { STATUS_IDLE, STATUS_LOADING, STATUS_ERROR, STATUS } from '@constants/statuses';
import { updateTopic } from '@services/update-topic';
import { FormLayout } from '@components/form-layout';
import { TOPIC_EDIT_SCREEN_ID, TOPIC_EDIT_INPUT_NAME } from '@e2e/ids';
import { StackNavigationProp } from '@react-navigation/stack';
import { TopicsStackParamList } from '@stacks/topics-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { TOPICS_EDIT_SCREEN } from '@constants/screens';
import { Topic } from '@models/topic';
import { isStringEmpty } from '@utils/is-string-empty';

type NavigationProps = StackNavigationProp<TopicsStackParamList, typeof TOPICS_EDIT_SCREEN>;
type RouteProps = RouteProp<TopicsStackParamList, typeof TOPICS_EDIT_SCREEN>;

export function EditTopicScreen() {
  const navigation = useNavigation<NavigationProps>();
  const inputRef = useRef<TextInput>(null);
  const route = useRoute<RouteProps>();
  const [status, setStatus] = useState<STATUS>(STATUS_IDLE);
  const [error, setError] = useState<string | undefined>(undefined);
  const [topic, setTopic] = useState<Topic>(route.params.topic);

  const submit = async () => {
    if (topic.name === route.params.topic.name) {
      navigation.goBack();
      return;
    }

    try {
      setStatus(STATUS_LOADING);
      await updateTopic(topic);
      navigation.goBack();
    } catch (error) {
      setStatus(STATUS_ERROR);
      setError(error instanceof Error ? error.message : 'An error occurred');
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const isDisabled =
          status === STATUS_LOADING ||
          isStringEmpty(topic.name) ||
          topic.name === route.params.topic.name;

        return <SaveButton disabled={isDisabled} onPress={submit} status={status} />;
      },
    });
  });

  const onNameChange = (name: string) => {
    setTopic({ ...topic, name });
  };

  return (
    <FormLayout status={status} error={error}>
      <View testID={TOPIC_EDIT_SCREEN_ID}>
        <InputText
          ref={inputRef}
          label="Name"
          placeholder="Topic's name"
          onChangeText={onNameChange}
          autoFocus={true}
          returnKeyType="send"
          onSubmitEditing={submit}
          value={topic.name}
          testID={TOPIC_EDIT_INPUT_NAME}
        />
      </View>
    </FormLayout>
  );
}
