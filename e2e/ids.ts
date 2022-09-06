// Signin
export const SIGNIN_SCREEN = 'signin-screen';
export const SIGNIN_INPUT_EMAIL = 'auth-input-email';
export const SIGNIN_INPUT_PASSWORD = 'auth-input-password';
export const SIGNIN_LINK_SIGNUP = 'signup-button';
export const SIGNIN_SUBMIT_BUTTON = 'signin-submit-button';

// Signup
export const SIGNUP_SCREEN = 'signup-screen';
export const SIGNUP_INPUT_EMAIL = 'signup-input-email';
export const SIGNUP_INPUT_PASSWORD = 'signup-input-password';
export const SIGNUP_LINK_SIGNIN = 'signup-link-signin';
export const SIGNUP_SUBMIT_BUTTON = 'signup-submit-button';

// Create topic screen
export const TOPIC_CREATE_SCREEN_ID = 'topic-create-screen';
export const TOPIC_CREATE_INPUT_NAME = 'topic-create-input-name';

// Topics screen
export const TOPICS_SCREEN_ID = 'topics-screen';
export const TOPICS_ROW = (topicId: string) => `topic-${topicId}`;
export const TOPICS_ROW_EDIT = (topicId: string) => `topic-edit-action-${topicId}`;
export const TOPICS_ROW_DELETE = (topicId: string) => `topic-delete-action-${topicId}`;
export const TOPICS_ROW_NAME = (topicId: string) => `topic-name-${topicId}`;
export const TOPICS_ROW_CARDS_COUNT = 'topic-cards-count';
export const TOPICS_ROW_UPDATED_AT = 'topic-updated-at';

// Topic edit screen
export const TOPIC_EDIT_SCREEN_ID = 'topic-edit-screen';
export const TOPIC_EDIT_INPUT_NAME = 'topic-edit-input-name';

// Settings screen
export const SETTINGS_SCREEN_ID = 'settings-screen';
export const SETTINGS_THEME_BUTTON = 'settings-theme-button';
export const SETTINGS_SIGNOUT_BUTTON = 'settings-signout-button';

// Card create screen
export const CARD_CREATE_SCREEN = 'card-create-screen';
export const CARD_CREATE_INPUT_VALUE = 'card-create-input-value';
export const CARD_CREATE_INPUT_DESCRIPTION = 'card-create-input-description';

// Card edit screen
export const CARD_EDIT_SCREEN = 'card-edit-screen';
export const CARD_EDIT_INPUT_VALUE = 'card-edit-input-value';
export const CARD_EDIT_INPUT_DESCRIPTION = 'card-edit-input-description';

// Cards screen
export const CARDS_SCREEN = 'cards-screen';
export const CARDS_ROW = (cardId: string) => `card-${cardId}`;
export const CARDS_ROW_EDIT = (cardId: string) => `card-edit-action-${cardId}`;
export const CARDS_ROW_DELETE = (cardId: string) => `card-delete-action-${cardId}`;
export const CARDS_ROW_VALUE = (cardId: string) => `card-value-${cardId}`;
export const CARDS_ROW_DESCRIPTION = 'card-description';

// Tabnav bottom
export const TABNAV_SETTINGS_FOCUSED = 'tabnav-settings-focused';
export const TABNAV_SETTINGS_UNFOCUSED = 'tabnav-settings-unfocused';

// Misc
export const ADD_BUTTON = (testID: string) => `button-add-${testID}`;
export const ERROR_MESSAGE = 'error-message';
export const EMPTY_LIST_MESSAGE = 'empty-list-message';
export const SAVE_BUTTON = 'save-button';
export const FILTER_OPEN_BUTTON = 'filter-open-button';
export const FILTER_CLOSE_BUTTON = 'filter-close-button';
