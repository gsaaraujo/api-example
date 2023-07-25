import { PrismaClient, Customer as CustomerORM } from '@prisma/client';

import { Email } from '@/auth/domain/models/email';
import { Password } from '@/auth/domain/models/password';
import { Customer } from '@/auth/domain/models/customer/customer';
import { ICustomerRepository } from '@/auth/domain/models/customer/customer-repository';

export class PrismaCustomerRepository implements ICustomerRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async create(customer: Customer): Promise<Customer> {
    const customerCreated = await this.prismaClient.customer.create({
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email.value,
        password: customer.password.value,
      },
    });

    return Customer.reconstitute(customerCreated.id, {
      name: customerCreated.name,
      email: Email.reconstitute({ value: customerCreated.email }),
      password: Password.reconstitute({ value: customerCreated.password }),
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const customerFound: CustomerORM | null = await this.prismaClient.customer.findUnique({
      where: { email },
    });

    return !!customerFound;
  }
}
