import { element, waitFor, by } from 'detox';
import { navigateToCardsScreen } from '@e2e/navigation/navigate-to-cards-screen';
import { CARDS_ROW, CARDS_ROW_EDIT, CARD_EDIT_SCREEN } from '@e2e/ids';

export async function navigateToEditCardScreen(topicId: string, cardId: string) {
  await navigateToCardsScreen(topicId);
  await element(by.id(CARDS_ROW(cardId))).swipe('left');
  await element(by.id(CARDS_ROW_EDIT(cardId))).tap();
  await waitFor(element(by.id(CARD_EDIT_SCREEN)))
    .toBeVisible()
    .withTimeout(1000);
}
