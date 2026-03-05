import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveFlightsCollectionName } from '../src/config/firestoreCollections.js';

test('uses explicit env collection when provided', () => {
  assert.equal(resolveFlightsCollectionName({ VITE_FIREBASE_FLIGHTS_COLLECTION: 'flights_canary' }), 'flights_canary');
});

test('falls back to safe preview collection when env is missing', () => {
  assert.equal(resolveFlightsCollectionName({}), 'flights_preview');
});

test('trims env collection name before using it', () => {
  assert.equal(resolveFlightsCollectionName({ VITE_FIREBASE_FLIGHTS_COLLECTION: '  flights_test  ' }), 'flights_test');
});
