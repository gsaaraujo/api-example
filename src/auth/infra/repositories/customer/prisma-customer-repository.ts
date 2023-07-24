import { PrismaClient, Customer as CustomerORM } from '@prisma/client';

import { Customer } from '@/auth/domain/models/customer/customer';
import { ICustomerRepository } from '@/auth/domain/models/customer/customer-repository';

export class PrismaCustomerRepository implements ICustomerRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async create(customer: Customer): Promise<Customer> {
    const customerCreated = await this.prismaClient.customer.create({
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        password: customer.password,
      },
    });

    return Customer.reconstitute(customerCreated.id, {
      name: customerCreated.name,
      email: customerCreated.email,
      password: customerCreated.password,
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const customerFound: CustomerORM | null = await this.prismaClient.customer.findUnique({
      where: { email },
    });

    return !!customerFound;
  }
}
