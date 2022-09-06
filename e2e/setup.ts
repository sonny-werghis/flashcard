import 'dotenv/config';
import { E2E_COLLECTION_TOPICS, E2E_COLLECTION_CARDS } from '@e2e/constants';
import { db, admin } from '@e2e/database/db';
import { deleteCollection } from '@e2e/database/delete-collection';
import { cleanup, init, device } from 'detox';
import config from '../detox.config';

beforeAll(async () => {
  await init(config as Detox.DetoxConfig, { initGlobals: false });
  await device.launchApp();
});

afterAll(async () => {
  await cleanup();
  await deleteCollection(db, E2E_COLLECTION_TOPICS);
  await deleteCollection(db, E2E_COLLECTION_CARDS);
  await admin.app().delete();
});
