import { beforeEach, describe, expect, it } from 'vitest';

import { Either } from '@/common/helpers/either';
import { BaseError } from '@/common/helpers/base-error';

import { SignUpUsecase } from '@/auth/domain/usecases/sign-up-usecase';
import { FakeCustomerRepository } from '@/auth/infra/repositories/customer/fake-customer-repository';
import { Customer } from '../models/customer/customer';
import { Email } from '../models/email';
import { Password } from '../models/password';
import { AccountAlreadyExistsError } from '../errors/account-already-exists-error';
import { InvalidNameError } from '../errors/invalid-name-error';
import { InvalidEmailError } from '../errors/invalid-email-error';
import { InvalidPasswordError } from '../errors/invalid-password-error';

describe('sign-up-usecase', () => {
  let signUpUsecase: SignUpUsecase;
  let fakeCustomerRepository: FakeCustomerRepository;

  beforeEach(() => {
    fakeCustomerRepository = new FakeCustomerRepository();
    signUpUsecase = new SignUpUsecase(fakeCustomerRepository);
  });

  it(`given the customer has no account
      when attempting to sign up
      and the credentials are valid
      then it should succeed`, async () => {
    fakeCustomerRepository.customers = [];

    const sut: Either<BaseError, void> = await signUpUsecase.execute({
      name: 'Gabriel',
      email: 'gabriel.houth@gmail.com',
      password: '123456789',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(fakeCustomerRepository.customers).toHaveLength(1);
  });

  it(`given the customer has an account
      when attempting to sign up
      and the credentials are valid
      then it should fail`, async () => {
    const customer: Customer = Customer.reconstitute('26a3a27f-1d89-460a-9e04-09f3d5a86851', {
      email: Email.reconstitute({ value: 'gabriel.houth@gmail.com' }),
      name: 'Gabriel',
      password: Password.reconstitute({
        value: 'aad113095ffd674d334f219dffb4097644f6a2ece74cd2ea1ab0cb94781372c9',
        salt: 'a2e8df9e9e96483189fc56257a14b3d9',
      }),
    });

    const output = new AccountAlreadyExistsError(
      'Already exists an account with this email address',
    );

    fakeCustomerRepository.customers.push(customer);

    const sut: Either<BaseError, void> = await signUpUsecase.execute({
      name: 'Gabriel',
      email: 'gabriel.houth@gmail.com',
      password: '123456789',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });

  it(`given the customer has no account
      when attempting to sign up
      and the name is invalid
      then it should fail`, async () => {
    const output = new InvalidNameError('Name must be between 2 and 50 characters');

    fakeCustomerRepository.customers = [];

    const sut: Either<BaseError, void> = await signUpUsecase.execute({
      name: 'G',
      email: 'gabriel.houth@gmail.com',
      password: '123456789',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });

  it(`given the customer has no account
      when attempting to sign up
      and the name is invalid
      then it should fail`, async () => {
    const output = new InvalidNameError('Name must be between 2 and 50 characters');

    fakeCustomerRepository.customers = [];

    const sut: Either<BaseError, void> = await signUpUsecase.execute({
      name: 'Gabriel'.repeat(50),
      email: 'gabriel.houth@gmail.com',
      password: '123456789',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });

  it(`given the customer has no account
      when attempting to sign up
      and the email is invalid
      then it should fail`, async () => {
    const output = new InvalidEmailError('Email is not a valid email address');

    fakeCustomerRepository.customers = [];

    const sut: Either<BaseError, void> = await signUpUsecase.execute({
      name: 'Gabriel',
      email: 'abc@com',
      password: '123456789',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });

  it(`given the customer has no account
      when attempting to sign up
      and the password is invalid
      then it should fail`, async () => {
    const output = new InvalidPasswordError('Password must be between 8 and 20 characters');

    fakeCustomerRepository.customers = [];

    const sut: Either<BaseError, void> = await signUpUsecase.execute({
      name: 'Gabriel',
      email: 'gabriel.houth@gmail.com',
      password: '123',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });

  it(`given the customer has no account
      when attempting to sign up
      and the password is invalid
      then it should fail`, async () => {
    const output = new InvalidPasswordError('Password must be between 8 and 20 characters');

    fakeCustomerRepository.customers = [];

    const sut: Either<BaseError, void> = await signUpUsecase.execute({
      name: 'Gabriel',
      email: 'gabriel.houth@gmail.com',
      password: '12345678'.repeat(50),
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });
});
