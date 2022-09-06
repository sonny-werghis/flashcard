import { expect, element, device, waitFor, by } from 'detox';
import { db } from '@e2e/database/db';
import { deleteCollection } from '@e2e/database/delete-collection';
import { E2E_COLLECTION_TOPICS, E2E_COLLECTION_CARDS } from '@e2e/constants';
import { signInUser } from '@e2e/navigation/sign-in-user';
import { navigateToCardsScreen } from '@e2e/navigation/navigate-to-cards-screen';
import { createTestUser } from '@e2e/database/create-test-user';
import { createTopic } from '@e2e/database/create-topic';
import { createCard } from '@e2e/database/create-card';
import {
  CARDS_SCREEN,
  CARDS_ROW,
  EMPTY_LIST_MESSAGE,
  CARDS_ROW_EDIT,
  CARD_EDIT_SCREEN,
  CARDS_ROW_DELETE,
  ADD_BUTTON,
  CARD_CREATE_SCREEN,
} from '@e2e/ids';

describe('CardsScreen screen', () => {
  let topicId: string;
  let cardId: string;
  const topicName = 'Topic1';
  const value = 'A value';

  beforeAll(async () => {
    await deleteCollection(db, E2E_COLLECTION_TOPICS);
    await createTestUser();
    await device.launchApp({ delete: true, newInstance: true });
    await signInUser();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('with cards', () => {
    beforeAll(async () => {
      const topic = await createTopic(topicName);
      topicId = topic.id;
      const card = await createCard(topic.id, value);
      cardId = card.id;
    });

    beforeEach(async () => {
      await navigateToCardsScreen(topicId);
    });

    it('should display the cards list', async () => {
      await expect(element(by.id(CARDS_SCREEN))).toBeVisible();
      await expect(element(by.id(CARDS_ROW(cardId)))).toBeVisible();
      await expect(element(by.id(EMPTY_LIST_MESSAGE))).toBeNotVisible();
    });

    it('should navigate to the screen to edit the card', async () => {
      await element(by.id(CARDS_ROW(cardId))).swipe('left');
      await element(by.id(CARDS_ROW_EDIT(cardId))).tap();

      await expect(element(by.id(CARD_EDIT_SCREEN))).toBeVisible();
    });

    it('should delete the card', async () => {
      await element(by.id(CARDS_ROW(cardId))).swipe('left');
      await element(by.id(CARDS_ROW_DELETE(cardId))).tap();
      if (process.env.PLATFORM === 'android') {
        await element(by.text('DELETE')).tap();
      } else {
        await element(by.type('_UIAlertControllerActionView').and(by.label('Delete'))).tap();
      }
      await waitFor(element(by.id(CARDS_ROW(cardId))))
        .toBeNotVisible()
        .withTimeout(3000);

      await expect(element(by.id(CARDS_ROW(cardId)))).toBeNotVisible();
    });
  });

  describe('without cards', () => {
    beforeAll(async () => {
      await deleteCollection(db, E2E_COLLECTION_TOPICS);
      await deleteCollection(db, E2E_COLLECTION_CARDS);
      const topic = await createTopic(topicName);
      topicId = topic.id;
    });

    beforeEach(async () => {
      await navigateToCardsScreen(topicId);
    });

    it('should display a message', async () => {
      await expect(element(by.id(EMPTY_LIST_MESSAGE))).toBeVisible();
    });
  });

  it('should navigate to the screen to create a card', async () => {
    await deleteCollection(db, E2E_COLLECTION_TOPICS);
    const topic = await createTopic(topicName);
    await navigateToCardsScreen(topic.id);

    await element(by.id(ADD_BUTTON(CARDS_SCREEN))).tap();
    await waitFor(element(by.id(CARD_CREATE_SCREEN)))
      .toBeVisible()
      .withTimeout(2000);
    await expect(element(by.id(CARD_CREATE_SCREEN))).toBeVisible();
  });
});
