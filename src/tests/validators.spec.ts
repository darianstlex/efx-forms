import { test, expect } from '@playwright/experimental-ct-react';

import {
  email,
  length,
  lessThan,
  matches,
  max,
  min,
  moreThan,
  negative,
  number,
  positive,
  required,
} from '../validators';

test.describe('Validators', async () => {
  test.describe('required', async () => {
    test('default message', async () => {
      const validate = required();
      expect(validate('')).toBe('This field is required');
    });
    test('custom message', async () => {
      const validate = required({ msg: 'Required!' });
      expect(validate('')).toBe('Required!');
    });
    test('ok', async () => {
      const validate = required();
      expect(validate('test')).toBe(false);
    });
  });

  test.describe('email', async () => {
    test('default message', async () => {
      const validate = email();
      expect(validate('')).toBe('Must be a valid email');
    });
    test('custom message', async () => {
      const validate = email({ msg: 'Should be valid' });
      expect(validate('test@test')).toBe('Should be valid');
    });
    test('ok', async () => {
      const validate = email();
      expect(validate('test@test.com')).toBe(false);
    });
  });

  test.describe('min', async () => {
    test('default message', async () => {
      const validate = min({ value: 20 });
      expect(validate('')).toBe('Must be greater or equal to 20');
      expect(validate(0)).toBe('Must be greater or equal to 20');
    });
    test('custom message', async () => {
      const validate = min({ value: 20, msg: 'Add more' });
      expect(validate('5')).toBe('Add more');
      expect(validate(5)).toBe('Add more');
    });
    test('ok', async () => {
      const validate = min({ value: 20 });
      expect(validate('50')).toBe(false);
      expect(validate(50)).toBe(false);
    });
  });

  test.describe('max', async () => {
    test('default message', async () => {
      const validate = max({ value: 20 });
      expect(validate('50')).toBe('Must be less or equal to 20');
      expect(validate(50)).toBe('Must be less or equal to 20');
    });
    test('custom message', async () => {
      const validate = max({ value: 20, msg: 'Less' });
      expect(validate('50')).toBe('Less');
      expect(validate(50)).toBe('Less');
    });
    test('ok', async () => {
      const validate = max({ value: 20 });
      expect(validate('5')).toBe(false);
      expect(validate(5)).toBe(false);
    });
  });

  test.describe('lessThan', async () => {
    test('default message', async () => {
      const validate = lessThan({ value: 5 });
      expect(validate('faraday')).toBe('Length must be less than 5');
    });
    test('custom message', async () => {
      const validate = lessThan({ value: 5, msg: 'Too long' });
      expect(validate('faraday')).toBe('Too long');
    });
    test('ok', async () => {
      const validate = lessThan({ value: 5 });
      expect(validate('test')).toBe(false);
    });
  });

  test.describe('moreThan', async () => {
    test('default message', async () => {
      const validate = moreThan({ value: 3 });
      expect(validate('de')).toBe('Length must be more than 3');
    });
    test('custom message', async () => {
      const validate = moreThan({ value: 3, msg: 'Too short' });
      expect(validate('de')).toBe('Too short');
    });
    test('ok', async () => {
      const validate = moreThan({ value: 3 });
      expect(validate('test')).toBe(false);
    });
  });

  test.describe('length', async () => {
    test('default message', async () => {
      const validate = length({ value: 3 });
      expect(validate('de')).toBe('Length must be exactly 3 characters');
    });
    test('custom message', async () => {
      const validate = length({ value: 3, msg: 'Nope' });
      expect(validate('de')).toBe('Nope');
    });
    test('ok', async () => {
      const validate = length({ value: 3 });
      expect(validate('tet')).toBe(false);
    });
  });

  test.describe('matches', async () => {
    test('default message', async () => {
      const validate = matches({ regexp: /some\dnum/, label: 'some0num' });
      expect(validate('test')).toBe('Must match the following: \'some0num\'');
    });
    test('custom message', async () => {
      const validate = matches({ regexp: /some\dnum/, msg: 'Nope' });
      expect(validate('test')).toBe('Nope');
    });
    test('ok', async () => {
      const validate = matches({ regexp: /some\dnum/ });
      expect(validate('some4num')).toBe(false);
    });
  });

  test.describe('positive', async () => {
    test('default message', async () => {
      const validate = positive();
      expect(validate(-2)).toBe('Must be a positive number');
    });
    test('custom message', async () => {
      const validate = positive({ msg: 'Nope' });
      expect(validate(-1)).toBe('Nope');
    });
    test('ok', async () => {
      const validate = positive();
      expect(validate(2)).toBe(false);
    });
  });

  test.describe('negative', async () => {
    test('default message', async () => {
      const validate = negative();
      expect(validate(2)).toBe('Must be a negative number');
    });
    test('custom message', async () => {
      const validate = negative({ msg: 'Nope' });
      expect(validate(1)).toBe('Nope');
    });
    test('ok', async () => {
      const validate = negative();
      expect(validate(-2)).toBe(false);
    });
  });

  test.describe('number', async () => {
    test('default message', async () => {
      const validate = number();
      expect(validate('tete')).toBe('Must be a number');
    });
    test('custom message', async () => {
      const validate = number({ msg: 'Nope' });
      expect(validate('we')).toBe('Nope');
    });
    test('ok', async () => {
      const validate = number();
      expect(validate(-2)).toBe(false);
      expect(validate(2)).toBe(false);
    });
  });
});
