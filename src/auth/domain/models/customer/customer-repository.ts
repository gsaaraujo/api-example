import { Customer } from '@/auth/domain/models/customer/customer';

export interface ICustomerRepository {
  create(customer: Customer): Promise<Customer>;
  existsByEmail(email: string): Promise<boolean>;
}
