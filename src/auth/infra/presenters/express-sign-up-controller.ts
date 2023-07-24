import { Response, Request } from 'express';

import { Either } from '@/common/helpers/either';
import { BaseError } from '@/common/helpers/base-error';

import { SignUpUsecase } from '@/auth/domain/usecases/sign-up-usecase';
import { InvalidNameError } from '@/auth/domain/errors/invalid-name-error';
import { InvalidEmailError } from '@/auth/domain/errors/invalid-email-error';
import { AccountAlreadyExistsError } from '@/auth/domain/errors/account-already-exists-error';

export class ExpressSignUpController {
  constructor(private readonly signUpUsecase: SignUpUsecase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const signUpOrError: Either<BaseError, void> = await this.signUpUsecase.execute({
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
    });

    if (signUpOrError.isRight()) {
      return response.status(204).send({});
    }

    const baseError: BaseError = signUpOrError.value;

    if (baseError instanceof InvalidNameError || baseError instanceof InvalidEmailError) {
      return response.status(400).send({ error: baseError.message });
    }

    if (baseError instanceof AccountAlreadyExistsError) {
      return response.status(409).send({ error: baseError.message });
    }

    return response.status(500).send({
      errorMessage: 'Something unexpected happened',
    });
  }
}
