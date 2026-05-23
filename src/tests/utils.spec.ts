import { test, expect } from '@playwright/experimental-ct-react';

import {
  truthyFy,
  shapeFy,
  hasTruthy,
  flattenObjectKeys,
  truthyFyStore,
  shapeFyStore,
} from '../utils';

/**
 * TEST SUITE: Utility Functions
 * 
 * WHAT: Tests pure utility functions for object manipulation
 * 
 * WHY: These utilities are used throughout the form library:
 * - truthyFy: Filter out falsy values (used in validation, state checks)
 * - shapeFy: Transform flat objects to nested (form data transformation)
 * - hasTruthy: Check if any truthy value exists (empty state detection)
 * - flattenObjectKeys: Extract all keys from nested structures (form introspection)
 * 
 * These are PURE FUNCTIONS - no side effects, deterministic, easy to test.
 * 
 * SCENARIOS:
 * 1. truthyFy: Remove null/undefined/empty from objects
 * 2. shapeFy: Convert { 'user.name': 'John' } → { user: { name: 'John' } }
 * 3. hasTruthy: Detect if object has any meaningful data
 * 4. flattenObjectKeys: Extract ['user.name', 'user.email'] from nested object
 * 5. Store variants: Same functions wrapped as effector store mappers
 * 
 * NOTE: These tests run in Playwright but don't need React mounting -
 * they're pure function tests using Playwright as test runner.
 */
test.describe('utils.ts', () => {
  test.describe('truthyFy', () => {
    test('returns empty object for empty input', () => {
      expect(truthyFy({})).toEqual({});
      expect(truthyFy()).toEqual({});
    });

    test('filters out falsy values', () => {
      const input = {
        a: 'truthy',
        b: '',
        c: null,
        d: undefined,
        e: 0,
        f: false,
        g: 'also truthy',
      };
      expect(truthyFy(input)).toEqual({
        a: 'truthy',
        g: 'also truthy',
      });
    });

    test('keeps truthy values including numbers and booleans', () => {
      const input = {
        num: 42,
        bool: true,
        str: 'hello',
        obj: { key: 'value' },
        arr: [1, 2, 3],
      };
      expect(truthyFy(input)).toEqual(input);
    });

    test('handles nested objects', () => {
      const input = {
        user: { name: 'John' },
        empty: null,
        settings: { theme: 'dark' },
      };
      expect(truthyFy(input)).toEqual({
        user: { name: 'John' },
        settings: { theme: 'dark' },
      });
    });
  });

  test.describe('shapeFy', () => {
    test('transforms flat keys to nested structure', () => {
      const input = {
        'user.name': 'John',
        'user.email': 'john@test.com',
        'user.address.city': 'NYC',
      };
      expect(shapeFy(input)).toEqual({
        user: {
          name: 'John',
          email: 'john@test.com',
          address: {
            city: 'NYC',
          },
        },
      });
    });

    test('handles empty input', () => {
      expect(shapeFy({})).toEqual({});
      expect(shapeFy()).toEqual({});
    });

    test('passes through non-nested keys', () => {
      const input = {
        name: 'John',
        email: 'john@test.com',
      };
      expect(shapeFy(input)).toEqual({
        name: 'John',
        email: 'john@test.com',
      });
    });

    test('handles mixed nested and flat keys', () => {
      const input = {
        name: 'John',
        'user.email': 'john@test.com',
        'user.profile.age': 30,
      };
      expect(shapeFy(input)).toEqual({
        name: 'John',
        user: {
          email: 'john@test.com',
          profile: {
            age: 30,
          },
        },
      });
    });
  });

  test.describe('hasTruthy', () => {
    test('returns false for empty object', () => {
      expect(hasTruthy({})).toBe(false);
    });

    test('returns false when all values are falsy', () => {
      expect(hasTruthy({ a: null, b: '', c: false, d: 0 })).toBe(false);
    });

    test('returns true when at least one value is truthy', () => {
      expect(hasTruthy({ a: null, b: 'truthy', c: false })).toBe(true);
      expect(hasTruthy({ a: 0, b: false, c: true })).toBe(true);
    });

    test('handles nested truthy values', () => {
      expect(hasTruthy({ a: { nested: 'value' } })).toBe(true);
    });
  });

  test.describe('flattenObjectKeys', () => {
    test('flattens nested object to one level', () => {
      const input = {
        user: {
          name: 'John',
          email: 'john@test.com',
        },
        settings: {
          theme: 'dark',
        },
      };
      expect(flattenObjectKeys(input)).toEqual({
        'user.name': 'John',
        'user.email': 'john@test.com',
        'settings.theme': 'dark',
      });
    });

    test('flattens arrays with bracket notation', () => {
      const input = {
        users: ['John', 'Jane'],
        tags: ['tag1', 'tag2', 'tag3'],
      };
      expect(flattenObjectKeys(input)).toEqual({
        'users[0]': 'John',
        'users[1]': 'Jane',
        'tags[0]': 'tag1',
        'tags[1]': 'tag2',
        'tags[2]': 'tag3',
      });
    });

    test('handles deeply nested structures', () => {
      const input = {
        user: {
          profile: {
            address: {
              city: 'NYC',
              zip: '10001',
            },
          },
        },
      };
      expect(flattenObjectKeys(input)).toEqual({
        'user.profile.address.city': 'NYC',
        'user.profile.address.zip': '10001',
      });
    });

    test('handles mixed arrays and objects', () => {
      const input = {
        users: [
          { name: 'John', email: 'john@test.com' },
          { name: 'Jane', email: 'jane@test.com' },
        ],
      };
      expect(flattenObjectKeys(input)).toEqual({
        'users[0].name': 'John',
        'users[0].email': 'john@test.com',
        'users[1].name': 'Jane',
        'users[1].email': 'jane@test.com',
      });
    });

    test('returns empty object for empty input', () => {
      expect(flattenObjectKeys({})).toEqual({});
      expect(flattenObjectKeys()).toEqual({});
    });

    test('passes through flat objects', () => {
      const input = {
        name: 'John',
        email: 'john@test.com',
      };
      expect(flattenObjectKeys(input)).toEqual(input);
    });
  });

  test.describe('truthyFyStore', () => {
    test('returns store that maps to truthy values', async () => {
      // This is a basic smoke test - full store testing requires effector setup
      expect(truthyFyStore).toBeDefined();
      expect(typeof truthyFyStore).toBe('function');
    });
  });

  test.describe('shapeFyStore', () => {
    test('returns store that maps to shaped values', async () => {
      // This is a basic smoke test - full store testing requires effector setup
      expect(shapeFyStore).toBeDefined();
      expect(typeof shapeFyStore).toBe('function');
    });
  });
});
