/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, expect, it } from 'vitest';

import { Either } from '@/common/helpers/either';
import { BaseError } from '@/common/helpers/base-error';

import { Email } from '@/auth/domain/models/email';
import { Password } from '@/auth/domain/models/password';
import { Customer } from '@/auth/domain/models/customer/customer';
import { InvalidNameError } from '@/auth/domain/errors/invalid-name-error';
import { InvalidPropertyError } from '@/auth/domain/errors/invalid-property-error';

describe('customer', () => {
  it(`given the values
      when creating customer
      and the values are valid
      it should succeed`, () => {
    const output: Customer = Customer.reconstitute('26a3a27f-1d89-460a-9e04-09f3d5a86851', {
      email: Email.reconstitute({ value: 'gabriel.houth@gmail.com' }),
      name: 'Gabriel',
      password: Password.reconstitute({
        value: 'aad113095ffd674d334f219dffb4097644f6a2ece74cd2ea1ab0cb94781372c9',
        salt: 'a2e8df9e9e96483189fc56257a14b3d9',
      }),
    });

    const sut: Either<BaseError, Customer> = Customer.create({
      email: Email.create({ value: 'gabriel.houth@gmail.com' }).value as Email,
      name: 'Gabriel',
      password: Password.create({
        value: '123456789',
        salt: 'a2e8df9e9e96483189fc56257a14b3d9',
      }).value as Password,
    });

    expect(sut.isRight()).toBeTruthy();
    expect((sut.value as Customer).email).toStrictEqual(output.email);
    expect((sut.value as Customer).name).toStrictEqual(output.name);
    expect((sut.value as Customer).password).toStrictEqual(output.password);
  });

  it(`(1) given the values
      when creating customer
      and the name is invalid
      it should fail`, () => {
    const output = new InvalidNameError('Name must be between 2 and 50 characters');

    const sut: Either<BaseError, Customer> = Customer.create({
      email: Email.create({ value: 'gabriel.houth@gmail.com' }).value as Email,
      name: 'G',
      password: Password.create({
        value: '123456789',
        salt: 'a2e8df9e9e96483189fc56257a14b3d9',
      }).value as Password,
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });

  it(`(2) given the values
      when creating customer
      and the name is invalid
      it should fail`, () => {
    const output = new InvalidNameError('Name must be between 2 and 50 characters');

    const sut: Either<BaseError, Customer> = Customer.create({
      email: Email.create({ value: 'gabriel.houth@gmail.com' }).value as Email,
      name: 'Gabriel'.repeat(50),
      password: Password.create({
        value: '123456789',
        salt: 'a2e8df9e9e96483189fc56257a14b3d9',
      }).value as Password,
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });

  it(`given the values
      when creating customer
      and the name is null
      it should fail`, () => {
    const output = new InvalidPropertyError('Name must be string and non-empty');

    const sut: Either<BaseError, Customer> = Customer.create({
      email: Email.create({ value: 'gabriel.houth@gmail.com' }).value as Email,
      name: null as any,
      password: Password.create({
        value: '123456789',
        salt: 'a2e8df9e9e96483189fc56257a14b3d9',
      }).value as Password,
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });

  it(`given the values
      when creating customer
      and the name is undefined
      it should fail`, () => {
    const output = new InvalidPropertyError('Name must be string and non-empty');

    const sut: Either<BaseError, Customer> = Customer.create({
      email: Email.create({ value: 'gabriel.houth@gmail.com' }).value as Email,
      name: undefined as any,
      password: Password.create({
        value: '123456789',
        salt: 'a2e8df9e9e96483189fc56257a14b3d9',
      }).value as Password,
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });

  it(`given the values
      when creating customer
      and the name is not string
      it should fail`, () => {
    const output = new InvalidPropertyError('Name must be string and non-empty');

    const sut: Either<BaseError, Customer> = Customer.create({
      email: Email.create({ value: 'gabriel.houth@gmail.com' }).value as Email,
      name: 123 as any,
      password: Password.create({
        value: '123456789',
        salt: 'a2e8df9e9e96483189fc56257a14b3d9',
      }).value as Password,
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });

  it(`given the values
      when creating customer
      and the name is empty
      it should fail`, () => {
    const output = new InvalidPropertyError('Name must be string and non-empty');

    const sut: Either<BaseError, Customer> = Customer.create({
      email: Email.create({ value: 'gabriel.houth@gmail.com' }).value as Email,
      name: ' ',
      password: Password.create({
        value: '123456789',
        salt: 'a2e8df9e9e96483189fc56257a14b3d9',
      }).value as Password,
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });
});
