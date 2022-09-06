import { element, waitFor, by } from 'detox';
import { TOPICS_SCREEN_ID, ADD_BUTTON, TOPIC_CREATE_SCREEN_ID } from '@e2e/ids';

export async function navigateToCreateTopicScreen() {
  await waitFor(element(by.id(TOPICS_SCREEN_ID))).toBeVisible();
  await element(by.id(ADD_BUTTON(TOPICS_SCREEN_ID))).tap();
  await waitFor(element(by.id(TOPIC_CREATE_SCREEN_ID)))
    .toBeVisible()
    .withTimeout(1000);
}
