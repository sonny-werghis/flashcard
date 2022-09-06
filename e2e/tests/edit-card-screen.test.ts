import { expect, element, device, waitFor, by } from 'detox';
import { db } from '@e2e/database/db';
import { deleteCollection } from '@e2e/database/delete-collection';
import { signInUser } from '@e2e/navigation/sign-in-user';
import { E2E_COLLECTION_TOPICS } from '@e2e/constants';
import { navigateToEditCardScreen } from '@e2e/navigation/navigate-to-edit-card-screen';
import { createTopic } from '@e2e/database/create-topic';
import { createCard } from '@e2e/database/create-card';
import {
  CARD_EDIT_INPUT_VALUE,
  CARD_EDIT_INPUT_DESCRIPTION,
  SAVE_BUTTON,
  CARDS_ROW_DESCRIPTION,
  CARDS_ROW_VALUE,
} from '@e2e/ids';

describe('Edit card screen', () => {
  let topicId: string;
  let cardId: string;
  const cardValue = 'A card';
  const cardDescription = 'A description';

  beforeAll(async () => {
    await deleteCollection(db, E2E_COLLECTION_TOPICS);
    const topic = await createTopic('A topic');
    topicId = topic.id;
    const card = await createCard(topic.id, cardValue, cardDescription);
    cardId = card.id;
    await device.launchApp({ delete: true, newInstance: true });
    await signInUser();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await navigateToEditCardScreen(topicId, cardId);
  });

  it('should display the form', async () => {
    await expect(element(by.text(cardValue).and(by.id(CARD_EDIT_INPUT_VALUE)))).toBeVisible();
    await expect(element(by.text(cardDescription).and(by.id(CARD_EDIT_INPUT_DESCRIPTION)))).toBeVisible();
    await expect(element(by.id(SAVE_BUTTON))).toBeVisible();
  });

  describe('invalid form', () => {
    it('should not submit the form if value is empty', async () => {
      await element(by.id(CARD_EDIT_INPUT_VALUE)).clearText();
      await element(by.id(SAVE_BUTTON)).tap();

      await expect(element(by.id(CARD_EDIT_INPUT_VALUE))).toBeVisible();
    });

  });

  it('should update the card description', async () => {
    await element(by.id(CARD_EDIT_INPUT_DESCRIPTION)).tap();
    // replaceText() doesn't play well with multine TextInput
    await element(by.id(CARD_EDIT_INPUT_DESCRIPTION)).clearText();
    await element(by.id(CARD_EDIT_INPUT_DESCRIPTION)).typeText('new description');
    await element(by.id(SAVE_BUTTON)).tap();
    await waitFor(element(by.id(CARDS_ROW_DESCRIPTION)))
      .toBeVisible()
      .withTimeout(2000);

    await expect(element(by.id(CARDS_ROW_DESCRIPTION).and(by.text('new description')))).toBeVisible();
  });


  it('should update the card value', async () => {
    await element(by.id(CARD_EDIT_INPUT_VALUE)).tap();
    await element(by.id(CARD_EDIT_INPUT_VALUE)).clearText();
    await element(by.id(CARD_EDIT_INPUT_VALUE)).typeText('new value');
    await element(by.id(SAVE_BUTTON)).tap();
    const cardRowId = CARDS_ROW_VALUE(cardId);
    await waitFor(element(by.id(cardRowId)))
      .toBeVisible()
      .withTimeout(2000);

    await expect(element(by.id(cardRowId).and(by.text('new value')))).toBeVisible();
  });
});
