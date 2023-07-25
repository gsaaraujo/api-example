import { Customer } from '@/auth/domain/models/customer/customer';
import { ICustomerRepository } from '@/auth/domain/models/customer/customer-repository';

export class FakeCustomerRepository implements ICustomerRepository {
  customers: Customer[] = [];

  async create(customer: Customer): Promise<Customer> {
    this.customers.push(customer);
    return customer;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const customerFound: Customer | undefined = this.customers.find(
      (customer) => customer.email.value === email,
    );

    return !!customerFound;
  }
}
