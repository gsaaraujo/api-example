import { PrismaClient } from '@prisma/client';

import { SignUpUsecase } from '@/auth/domain/usecases/sign-up-usecase';

import { ExpressSignUpController } from '@/auth/infra/presenters/express-sign-up-controller';
import { PrismaCustomerRepository } from '@/auth/infra/repositories/customer/prisma-customer-repository';

const prisma = new PrismaClient();

const prismaCustomerRepository = new PrismaCustomerRepository(prisma);
const signupUsecase = new SignUpUsecase(prismaCustomerRepository);

const expressSignupController = new ExpressSignUpController(signupUsecase);

export { expressSignupController };
