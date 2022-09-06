import { element, waitFor, by } from 'detox';
import { navigateToCardsScreen } from '@e2e/navigation/navigate-to-cards-screen';
import { ADD_BUTTON, CARDS_SCREEN, CARD_CREATE_SCREEN } from '@e2e/ids';

export async function navigateToCreateCardScreen(topicName: string) {
  await navigateToCardsScreen(topicName);
  await element(by.id(ADD_BUTTON(CARDS_SCREEN))).tap();
  await waitFor(element(by.id(CARD_CREATE_SCREEN)))
    .toBeVisible()
    .withTimeout(1000);
}
