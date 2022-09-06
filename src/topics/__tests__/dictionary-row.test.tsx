import React from 'react';
import { ParamListBase } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { CARDS_SCREEN } from '@constants/screens';
import { TOPICS_ROW, TOPICS_ROW_CARDS_COUNT, TOPICS_ROW_UPDATED_AT } from '@e2e/ids';
import { TopicRow } from '../topic-row';
import { Topic } from '@models/topic';

const push = jest.fn((path: string, params: ParamListBase) => path + params);

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: function () {
      return {
        push,
      };
    },
  };
});

jest.mock('@react-native-firebase/firestore', () => undefined);

describe('TopicRow', () => {
  const topicMock: Topic = {
    id: 'id',
    name: 'a name',
    cards: [],
    createdAt: null,
    updatedAt: null,
  };

  const renderComponent = (topic: Partial<Topic> | undefined = undefined) => {
    return render(
      <TopicRow
        testID={TOPICS_ROW('id')}
        topic={{
          ...topicMock,
          ...topic,
        }}
      />
    );
  };

  describe('interactions', () => {
    it('should navigate to the cards screen on press', () => {
      const { getByTestId } = renderComponent();
      fireEvent.press(getByTestId(TOPICS_ROW('id')));

      expect(push).toHaveBeenCalledWith(CARDS_SCREEN, {
        topic: topicMock,
        title: topicMock.name,
      });
    });
  });

  describe('render', () => {
    it('should render the topic name', () => {
      const { getByText } = renderComponent();
      getByText('a name');
    });

    it('should render the number of cards in the topic', () => {
      const { getByTestId, getByText } = renderComponent({
        cards: ['a card', 'two card'],
      });
      getByTestId(TOPICS_ROW_CARDS_COUNT);
      getByText(/2 card\(s\)/i);
    });

    describe('without updated date', () => {
      it('should not render the update date', () => {
        const { queryByTestId } = renderComponent();
        expect(queryByTestId(TOPICS_ROW_UPDATED_AT)).toBeNull();
      });
    });

    describe('with updated date', () => {
      it('should render the update date', () => {
        const date = new Date();
        const { getByTestId, queryByText } = renderComponent({
          updatedAt: {
            toDate: () => date,
          } as FirebaseFirestoreTypes.Timestamp,
        });
        expect(getByTestId(TOPICS_ROW_UPDATED_AT)).not.toBeNull();
        expect(getByTestId('clock-icon')).not.toBeNull();
        expect(queryByText(date.toLocaleDateString())).not.toBeNull();
      });
    });
  });
});
