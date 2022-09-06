import { expect, element, device, waitFor, by } from 'detox';
import { db } from '@e2e/database/db';
import { deleteCollection } from '@e2e/database/delete-collection';
import { signInUser } from '@e2e/navigation/sign-in-user';
import { E2E_COLLECTION_TOPICS } from '@e2e/constants';
import { createTestUser } from '@e2e/database/create-test-user';
import { navigateToCreateTopicScreen } from '@e2e/navigation/navigate-to-create-topic-screen';
import { createTopic } from '@e2e/database/create-topic';
import { getTopicByName } from '@e2e/database/getTopicByName';
import { TOPIC_CREATE_INPUT_NAME, SAVE_BUTTON, TOPIC_CREATE_SCREEN_ID, TOPICS_ROW } from '@e2e/ids';
import { sleep } from '@e2e/utils/sleep';

describe('Create topic screen', () => {
  beforeAll(async () => {
    await deleteCollection(db, E2E_COLLECTION_TOPICS);
    await createTestUser();
    await device.launchApp({ delete: true, newInstance: true });
    await signInUser();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await navigateToCreateTopicScreen();
  });

  it('should display the form', async () => {
    await expect(element(by.id(TOPIC_CREATE_SCREEN_ID))).toBeVisible();
  });

  it('should not submit the form if it is invalid', async () => {
    await element(by.id(TOPIC_CREATE_INPUT_NAME)).replaceText('');
    await element(by.id(SAVE_BUTTON)).tap();
    await expect(element(by.id(TOPIC_CREATE_INPUT_NAME))).toBeVisible();
  });

  it('should create a topic', async () => {
    await element(by.id(TOPIC_CREATE_INPUT_NAME)).tap();
    await element(by.id(TOPIC_CREATE_INPUT_NAME)).typeText('test');
    await element(by.id(SAVE_BUTTON)).tap();
    // Give some time to Firestore to create the doc.
    await sleep(4000);
    const topic = await getTopicByName('test');
    const topicRowID = TOPICS_ROW(topic.id);
    await waitFor(element(by.id(topicRowID)))
      .toBeVisible()
      .withTimeout(3000);

    await expect(element(by.id(topicRowID))).toBeVisible();
  });

  it('should display an error if the topic name already exists', async () => {
    await createTopic('Nop');
    await element(by.id(TOPIC_CREATE_INPUT_NAME)).typeText('Nop');
    await element(by.id(SAVE_BUTTON)).tap();

    const error = 'This topic already exists.';
    await waitFor(element(by.text(error)))
      .toBeVisible()
      .withTimeout(4000);
    await expect(element(by.text(error))).toBeVisible();
  });
});
