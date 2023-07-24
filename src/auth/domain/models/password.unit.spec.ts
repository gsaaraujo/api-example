import { describe, expect, it } from 'vitest';

import { Either } from '@/common/helpers/either';
import { BaseError } from '@/common/helpers/base-error';

import { Password } from '@/auth/domain/models/password';

describe('password', () => {
  it(`given the password
      when creating password
      and password is valid
      then it should succeed`, () => {
    const output: Password = Password.reconstitute({
      value: 'aad113095ffd674d334f219dffb4097644f6a2ece74cd2ea1ab0cb94781372c9',
      salt: 'a2e8df9e9e96483189fc56257a14b3d9',
    });

    const sut: Either<BaseError, Password> = Password.create({
      value: '123456789',
      salt: 'a2e8df9e9e96483189fc56257a14b3d9',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });
});
