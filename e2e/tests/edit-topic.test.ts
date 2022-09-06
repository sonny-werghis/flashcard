import { expect, element, device, waitFor, by } from 'detox';
import { db } from '@e2e/database/db';
import { deleteCollection } from '@e2e/database/delete-collection';
import { signInUser } from '@e2e/navigation/sign-in-user';
import { E2E_COLLECTION_TOPICS } from '@e2e/constants';
import { createTopic } from '@e2e/database/create-topic';
import { navigateToEditTopicScreen } from '@e2e/navigation/navigate-to-edit-topic-screen';
import { TOPIC_EDIT_INPUT_NAME, SAVE_BUTTON, TOPICS_ROW_NAME } from '@e2e/ids';

describe('Edit topic screen', () => {
  const topicName = 'Topic1';
  let topicId: string;

  beforeAll(async () => {
    await device.launchApp({ delete: true, newInstance: true });
    await deleteCollection(db, E2E_COLLECTION_TOPICS);
    const topic = await createTopic(topicName);
    topicId = topic.id;
    await signInUser();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await navigateToEditTopicScreen(topicId);
  });

  it('should display the form', async () => {
    await expect(element(by.text(topicName).and(by.id(TOPIC_EDIT_INPUT_NAME)))).toBeVisible();
    await expect(element(by.id(SAVE_BUTTON))).toBeVisible();
  });

  it('should not submit the form if it is invalid', async () => {
    await element(by.id(TOPIC_EDIT_INPUT_NAME)).replaceText('');
    await element(by.id(SAVE_BUTTON)).tap();
    await expect(element(by.id(TOPIC_EDIT_INPUT_NAME))).toBeVisible();
  });

  it('should change the topic name', async () => {
    await element(by.id(TOPIC_EDIT_INPUT_NAME)).tap();
    await element(by.id(TOPIC_EDIT_INPUT_NAME)).replaceText('test');
    await element(by.id(SAVE_BUTTON)).tap();
    const topicRowId = TOPICS_ROW_NAME(topicId);
    await waitFor(element(by.id(topicRowId).and(by.text('test'))))
      .toBeVisible()
      .withTimeout(4000);
    await expect(element(by.id(topicRowId).and(by.text('test')))).toBeVisible();
  });
});
