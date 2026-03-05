import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeStatus,
  formatArrival,
  resolveFlightNumber,
  chunkFlightNumbers,
  getTodayMadeiraDate,
  resolveApiKey
} from '../src/services/fr24Client.js';

test('normalizeStatus maps API statuses to UI labels', () => {
  assert.equal(normalizeStatus('scheduled'), 'Scheduled');
  assert.equal(normalizeStatus('departed'), 'Departed');
  assert.equal(normalizeStatus('landed'), 'Arrived');
  assert.equal(normalizeStatus('unknown'), 'Unknown');
});

test('formatArrival selects selectedUtc then formats HH:mm in Madeira', () => {
  const result = {
    arrivalTime: {
      selectedUtc: '2026-03-02T12:00:00.000Z',
      estimatedUtc: '2026-03-02T12:10:00.000Z',
      scheduledUtc: '2026-03-02T12:20:00.000Z'
    }
  };

  assert.equal(formatArrival(result), '12:00');
});

test('resolveFlightNumber supports legacy ICAO mappings', () => {
  assert.equal(resolveFlightNumber({ icao: 'WMT', number: '6110' }), 'W46110');
  assert.equal(resolveFlightNumber({ icao: 'MBU', number: '123' }), 'DI123');
  assert.equal(resolveFlightNumber({ icao: 'JAF', number: '345' }), 'TB345');
  assert.equal(resolveFlightNumber({ icao: '4Y*', number: '987' }), '4Y987');
  assert.equal(resolveFlightNumber({ icao: 'D8*', number: '777' }), 'D8777');
});

test('chunkFlightNumbers enforces max 25 per request', () => {
  const input = Array.from({ length: 57 }, (_, i) => `TP${1000 + i}`);
  const chunks = chunkFlightNumbers(input, 25);

  assert.equal(chunks.length, 3);
  assert.equal(chunks[0].length, 25);
  assert.equal(chunks[1].length, 25);
  assert.equal(chunks[2].length, 7);
});

test('getTodayMadeiraDate returns YYYY-MM-DD', () => {
  const today = getTodayMadeiraDate();
  assert.match(today, /^\d{4}-\d{2}-\d{2}$/);
});

test('resolveApiKey trims configured key', () => {
  assert.equal(resolveApiKey({ VITE_FR24_API_KEY: '  abc123  ' }), 'abc123');
});

test('resolveApiKey falls back to legacy VITE_API_KEY', () => {
  assert.equal(resolveApiKey({ VITE_API_KEY: 'legacy-key' }), 'legacy-key');
});
