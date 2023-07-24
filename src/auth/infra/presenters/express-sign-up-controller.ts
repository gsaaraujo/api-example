import { Response, Request } from 'express';

import { Either } from '@/common/helpers/either';
import { BaseError } from '@/common/helpers/base-error';
import { SignUpUsecase } from '@/auth/domain/usecases/sign-up-usecase';

export class ExpressSignUpController {
  constructor(private readonly signUpUsecase: SignUpUsecase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const signUpUsecase: Either<BaseError, void> = await this.signUpUsecase.execute({
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
    });

    return response.status(204).send({});
  }
}
