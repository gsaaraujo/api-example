import { PrismaClient } from '@prisma/client';

import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('express-sign-up-controller', () => {
  let prismaClient: PrismaClient;

  beforeAll(() => {
    prismaClient = new PrismaClient();
  });

  afterAll(async () => {
    await prismaClient.$transaction([prismaClient.customer.deleteMany()]);
    prismaClient.$disconnect;
  });

  it(`given the customer has no account
      when attempting to sign up
      and the credentials are valid
      then it should succeed`, async () => {
    const sut = await request('http://localhost:3000')
      .post('/auth/sign-up')
      .set('Content-Type', 'application/json')
      .send({
        name: 'Gabriel',
        email: 'gabriel.houth@gmail.com',
        password: '123456789',
      });

    expect(sut.status).toBe(204);
    expect(sut.body).toStrictEqual({});
  });
});
