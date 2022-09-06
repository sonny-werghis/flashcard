import { expect, element, device, waitFor, by } from 'detox';
import { db } from '@e2e/database/db';
import { deleteCollection } from '@e2e/database/delete-collection';
import { signInUser } from '@e2e/navigation/sign-in-user';
import { E2E_COLLECTION_TOPICS } from '@e2e/constants';
import { createTestUser } from '@e2e/database/create-test-user';
import { createTopic } from '@e2e/database/create-topic';
import {
  TOPICS_SCREEN_ID,
  TOPICS_ROW,
  EMPTY_LIST_MESSAGE,
  CARDS_SCREEN,
  TOPICS_ROW_EDIT,
  TOPIC_EDIT_SCREEN_ID,
  TOPICS_ROW_DELETE,
  ADD_BUTTON,
  TOPIC_CREATE_SCREEN_ID,
} from '@e2e/ids';

describe('Topics screen', () => {
  beforeAll(async () => {
    await createTestUser();
    await device.launchApp({ delete: true, newInstance: true });
    await signInUser();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('with topics', () => {
    let topic1Id: string;
    let topic2Id: string;

    beforeAll(async () => {
      await deleteCollection(db, E2E_COLLECTION_TOPICS);
      const topic1 = await createTopic('Topic1');
      topic1Id = topic1.id;
      const topic2 = await createTopic('Topic2');
      topic2Id = topic2.id;
    });

    beforeEach(async () => {
      await waitFor(element(by.id(TOPICS_ROW(topic1Id))))
        .toBeVisible()
        .withTimeout(4000);
      await waitFor(element(by.id(TOPICS_ROW(topic2Id)))).toBeVisible();
    });

    it('should display the topics list', async () => {
      await expect(element(by.id(TOPICS_ROW(topic1Id)))).toBeVisible();
      await expect(element(by.id(TOPICS_ROW(topic2Id)))).toBeVisible();
      await expect(element(by.id(EMPTY_LIST_MESSAGE))).toBeNotVisible();
    });

    it('should navigate to cards screen', async () => {
      await element(by.id(TOPICS_ROW(topic2Id))).tap();

      await expect(element(by.id(CARDS_SCREEN))).toBeVisible();
    });

    it('should navigate to the screen to edit the topic', async () => {
      await element(by.id(TOPICS_ROW(topic1Id))).swipe('left');
      await element(by.id(TOPICS_ROW_EDIT(topic1Id))).tap();

      await expect(element(by.id(TOPIC_EDIT_SCREEN_ID))).toBeVisible();
    });

    it('should delete the topic', async () => {
      await element(by.id(TOPICS_ROW(topic1Id))).swipe('left');
      await element(by.id(TOPICS_ROW_DELETE(topic1Id))).tap();
      if (process.env.PLATFORM === 'android') {
        await element(by.text('DELETE')).tap();
      } else {
        await element(by.type('_UIAlertControllerActionView').and(by.label('Delete'))).tap();
      }
      const topicRowId = TOPICS_ROW(topic1Id);
      await waitFor(element(by.id(topicRowId)))
        .toBeNotVisible()
        .withTimeout(3000);

      await expect(element(by.id(topicRowId))).toBeNotVisible();
    });
  });

  describe('without topics', () => {
    beforeAll(async () => {
      await deleteCollection(db, E2E_COLLECTION_TOPICS);
    });

    it('should display a message', async () => {
      await expect(element(by.id(EMPTY_LIST_MESSAGE))).toBeVisible();
    });
  });

  it('should navigate to the screen to create a topic', async () => {
    const buttonId = ADD_BUTTON(TOPICS_SCREEN_ID);
    await waitFor(element(by.id(buttonId))).toBeNotVisible();
    await element(by.id(buttonId)).tap();
    await expect(element(by.id(TOPIC_CREATE_SCREEN_ID))).toBeVisible();
  });
});
