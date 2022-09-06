import { expect, element, device, by, waitFor } from 'detox';
import { db } from '@e2e/database/db';
import { deleteCollection } from '@e2e/database/delete-collection';
import { signInUser } from '@e2e/navigation/sign-in-user';
import { E2E_COLLECTION_TOPICS, E2E_COLLECTION_CARDS } from '@e2e/constants';
import { createTopic } from '@e2e/database/create-topic';
import { createTestUser } from '@e2e/database/create-test-user';
import { navigateToCreateCardScreen } from '@e2e/navigation/navigate-to-create-card-screen';
import { createCard } from '@e2e/database/create-card';
import { getCardByValue } from '@e2e/database/getCardByValue';
import {
  CARD_CREATE_INPUT_VALUE,
  CARD_CREATE_INPUT_DESCRIPTION,
  SAVE_BUTTON,
  CARDS_ROW,
} from '@e2e/ids';
import { sleep } from '@e2e/utils/sleep';

describe('Create card screen', () => {
  let topicId: string;

  beforeAll(async () => {
    await deleteCollection(db, E2E_COLLECTION_TOPICS);
    const topic = await createTopic('A topic');
    topicId = topic.id;
    await createTestUser();
    await device.launchApp({ delete: true, newInstance: true });
    await signInUser();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await navigateToCreateCardScreen(topicId);
  });

  it('should display the form', async () => {
    await expect(element(by.id(CARD_CREATE_INPUT_VALUE))).toBeVisible();
    await expect(element(by.id(CARD_CREATE_INPUT_DESCRIPTION))).toBeVisible();
    await expect(element(by.id(SAVE_BUTTON))).toBeVisible();
  });

  describe('the form is invalid', () => {
    beforeAll(async () => {
      await createCard(topicId, 'Card');
    });

    beforeEach(async () => {
      await device.reloadReactNative();
      await navigateToCreateCardScreen(topicId);
    });

    it('should not submit the form if value is empty', async () => {
      await waitFor(element(by.id(CARD_CREATE_INPUT_VALUE))).toBeVisible();
      await element(by.id(CARD_CREATE_INPUT_VALUE)).replaceText('');
      await element(by.id(SAVE_BUTTON)).tap();

      await expect(element(by.id(CARD_CREATE_INPUT_VALUE))).toBeVisible();
    });

    it('should display an error if the card already exists in the topic', async () => {
      await element(by.id(CARD_CREATE_INPUT_VALUE)).tap();
      await element(by.id(CARD_CREATE_INPUT_VALUE)).typeText('Card');
      await element(by.id(SAVE_BUTTON)).tap();

      const error = 'This card already exists in this topic.';
      await waitFor(element(by.text(error)))
        .toBeVisible()
        .withTimeout(4000);
      await expect(element(by.text(error))).toBeVisible();
    });
  });

  it('should create a card', async () => {
    await deleteCollection(db, E2E_COLLECTION_CARDS);

    await element(by.id(CARD_CREATE_INPUT_VALUE)).tap();
    await element(by.id(CARD_CREATE_INPUT_VALUE)).typeText('Value');
    await element(by.id(CARD_CREATE_INPUT_DESCRIPTION)).tap();
    await element(by.id(CARD_CREATE_INPUT_DESCRIPTION)).typeText('Description');
    await element(by.id(SAVE_BUTTON)).tap();

    // Give some time to Firestore to create the doc.
    await sleep(4000);
    const card = await getCardByValue('Value');

    await expect(element(by.id(CARDS_ROW(card.id)))).toBeVisible();
  });
});
