import { Usecase } from '@common/helpers/usecase';
import { BaseError } from '@common/helpers/base-error';
import { Either, left, right } from '@common/helpers/either';

import { Customer } from '@/auth/domain/models/customer/customer';
import { ICustomerRepository } from '@/auth/domain/models/customer/customer-repository';

export type SignUpUsecaseInput = {
  name: string;
  email: string;
  password: string;
};

export type SignUpUsecaseOutput = void;

export class SignUpUsecase extends Usecase<SignUpUsecaseInput, SignUpUsecaseOutput> {
  public constructor(private readonly customerRepository: ICustomerRepository) {
    super();
  }

  public async execute(input: SignUpUsecaseInput): Promise<Either<BaseError, void>> {
    const customerOrError: Either<BaseError, Customer> = Customer.create({
      name: input.name,
      email: input.email,
      password: input.password,
    });

    if (customerOrError.isLeft()) {
      const error: BaseError = customerOrError.value;
      return left(error);
    }

    const customer: Customer = customerOrError.value;
    await this.customerRepository.create(customer);

    return right(undefined);
  }
}
