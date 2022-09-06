import { element, waitFor, by } from 'detox';
import { TOPICS_ROW, CARDS_SCREEN } from '@e2e/ids';

export async function navigateToCardsScreen(topicId: string) {
  await waitFor(element(by.id(TOPICS_ROW(topicId))))
    .toBeVisible()
    .withTimeout(3000);
  await element(by.id(TOPICS_ROW(topicId))).tap();
  await waitFor(element(by.id(CARDS_SCREEN)))
    .toBeVisible()
    .withTimeout(1000);
}
