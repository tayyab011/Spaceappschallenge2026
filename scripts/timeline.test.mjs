import test from 'node:test';
import assert from 'node:assert/strict';
import { filterByYear, sortByYear, yearBounds } from '../src/map/timeline.ts';

// TEST FIXTURE ONLY: made-up years, never shipped.
const items = [
  { name: 'B', left_behind: 1990 },
  { name: 'A', left_behind: 1990 },
  { name: 'C', left_behind: 2010 },
];

test('yearBounds is null for empty input', () => assert.equal(yearBounds([]), null));
test('yearBounds finds min and max', () => assert.deepEqual(yearBounds(items), { min: 1990, max: 2010 }));
test('filterByYear(null) keeps everything', () => assert.equal(filterByYear(items, null).length, 3));
test('filterByYear is inclusive', () => assert.deepEqual(filterByYear(items, 1990).map((i) => i.name), ['B', 'A']));
test('filterByYear before the first year is empty', () => assert.equal(filterByYear(items, 1980).length, 0));
test('sortByYear orders by year then name', () => assert.deepEqual(sortByYear(items).map((i) => i.name), ['A', 'B', 'C']));
