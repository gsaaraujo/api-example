/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, expect, it } from 'vitest';

import { BaseError } from '@/common/helpers/base-error';

import { Email } from '@/auth/domain/models/email';
import { InvalidEmailError } from '@/auth/domain/errors/invalid-email-error';
import { InvalidPropertyError } from '@/auth/domain/errors/invalid-property-error';

describe('email', () => {
  it(`given the value
      when creating email
      and value is valid
      then it should succeed`, () => {
    const output: Email = Email.reconstitute({ value: 'gabriel.houth@gmail.com' });

    const sut = Email.create({ value: 'gabriel.houth@gmail.com' });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });

  it(`given the value
      when creating email
      and value is invalid
      then it should fail`, () => {
    const output: BaseError = new InvalidEmailError('Email is not a valid email address');

    const sut = Email.create({ value: 'abc@com' });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });

  it(`given the value
      when creating email
      and value is null
      then it should fail`, () => {
    const output: BaseError = new InvalidPropertyError('Email must be string and non-empty');

    const sut = Email.create({ value: null as any });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });

  it(`given the value
      when creating email
      and value is null
      then it should fail`, () => {
    const output: BaseError = new InvalidPropertyError('Email must be string and non-empty');

    const sut = Email.create({ value: null as any });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });

  it(`given the value
      when creating email
      and value is undefined
      then it should fail`, () => {
    const output: BaseError = new InvalidPropertyError('Email must be string and non-empty');

    const sut = Email.create({ value: undefined as any });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });

  it(`given the value
      when creating email
      and value is not string
      then it should fail`, () => {
    const output: BaseError = new InvalidPropertyError('Email must be string and non-empty');

    const sut = Email.create({ value: 1 as any });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });

  it(`given the value
      when creating email
      and value is empty
      then it should fail`, () => {
    const output: BaseError = new InvalidPropertyError('Email must be string and non-empty');

    const sut = Email.create({ value: ' ' });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });
});
