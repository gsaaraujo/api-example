import { describe, expect, it } from 'vitest';

import { BaseError } from '@/common/helpers/base-error';

import { Email } from '@/auth/domain/models/email';
import { InvalidEmailError } from '@/auth/domain/errors/invalid-email-error';

describe('email', () => {
  it(`given the email
      when creating email
      and email is valid
      then it should succeed`, () => {
    const output: Email = Email.reconstitute({ value: 'gabriel.houth@gmail.com' });

    const sut = Email.create({ value: 'gabriel.houth@gmail.com' });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });

  it(`given the properties
      when creating email
      then it should fail`, () => {
    const output: BaseError = new InvalidEmailError('Email is not a valid email address');

    const sut = Email.create({ value: 'abc@com' });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });
});
