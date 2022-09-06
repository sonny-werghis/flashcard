import { element, waitFor, by } from 'detox';
import { TOPICS_ROW, TOPICS_ROW_EDIT, TOPIC_EDIT_SCREEN_ID } from '@e2e/ids';

export async function navigateToEditTopicScreen(topicId: string) {
  await waitFor(element(by.id(TOPICS_ROW(topicId))))
    .toBeVisible()
    .withTimeout(4000);
  await element(by.id(TOPICS_ROW(topicId))).swipe('left');
  await element(by.id(TOPICS_ROW_EDIT(topicId))).tap();
  await waitFor(element(by.id(TOPIC_EDIT_SCREEN_ID)))
    .toBeVisible()
    .withTimeout(1000);
}
