import { PrismaClient } from '@prisma/client';

import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

describe('express-sign-up-controller', () => {
  let prismaClient: PrismaClient;

  beforeAll(() => {
    prismaClient = new PrismaClient();
  });

  afterAll(async () => {
    prismaClient.$disconnect;
  });

  beforeEach(async () => {
    await prismaClient.$transaction([prismaClient.customer.deleteMany()]);
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

  it(`given the customer has an account
      when attempting to sign up
      and the credentials are valid
      then it should fail`, async () => {
    await prismaClient.customer.create({
      data: {
        id: '5f23f6a6-d023-4d67-aba6-46d947129d74',
        name: 'Gabriel',
        email: 'gabriel.houth@gmail.com',
        password: '123456789',
      },
    });

    const sut = await request('http://localhost:3000')
      .post('/auth/sign-up')
      .set('Content-Type', 'application/json')
      .send({
        name: 'Gabriel',
        email: 'gabriel.houth@gmail.com',
        password: '123456789',
      });

    expect(sut.status).toBe(409);
    expect(sut.body).toStrictEqual({
      error: 'Already exists an account with this email address',
    });
  });

  describe('name', () => {
    it(`(1) given the customer has no account
      when attempting to sign up
      and the name is invalid
      then it should fail`, async () => {
      const sut = await request('http://localhost:3000')
        .post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send({
          name: 'G',
          email: 'gabriel.houth@gmail.com',
          password: '123456789',
        });

      expect(sut.status).toBe(400);
      expect(sut.body).toStrictEqual({
        error: 'Name must be between 2 and 50 characters',
      });
    });

    it(`(2) given the customer has no account
      when attempting to sign up
      and the name is invalid
      then it should fail`, async () => {
      const sut = await request('http://localhost:3000')
        .post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Gabriel'.repeat(50),
          email: 'gabriel.houth@gmail.com',
          password: '123456789',
        });

      expect(sut.status).toBe(400);
      expect(sut.body).toStrictEqual({
        error: 'Name must be between 2 and 50 characters',
      });
    });

    it(`given the customer has no account
        when attempting to sign up
        and the name is undefined
        then it should fail`, async () => {
      const sut = await request('http://localhost:3000')
        .post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send({
          name: undefined,
          email: 'gabriel.houth@gmail.com',
          password: '123456789',
        });

      expect(sut.status).toBe(400);
      expect(sut.body).toStrictEqual({
        error: 'Name must be string and non-empty',
      });
    });

    it(`given the customer has no account
        when attempting to sign up
        and the name is null
        then it should fail`, async () => {
      const sut = await request('http://localhost:3000')
        .post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send({
          name: null,
          email: 'gabriel.houth@gmail.com',
          password: '123456789',
        });

      expect(sut.status).toBe(400);
      expect(sut.body).toStrictEqual({
        error: 'Name must be string and non-empty',
      });
    });

    it(`given the customer has no account
        when attempting to sign up
        and the name is empty
        then it should fail`, async () => {
      const sut = await request('http://localhost:3000')
        .post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send({
          name: ' ',
          email: 'gabriel.houth@gmail.com',
          password: '123456789',
        });

      expect(sut.status).toBe(400);
      expect(sut.body).toStrictEqual({
        error: 'Name must be string and non-empty',
      });
    });

    it(`given the customer has no account
        when attempting to sign up
        and the name is not a string
        then it should fail`, async () => {
      const sut = await request('http://localhost:3000')
        .post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send({
          name: 1,
          email: 'gabriel.houth@gmail.com',
          password: '123456789',
        });

      expect(sut.status).toBe(400);
      expect(sut.body).toStrictEqual({
        error: 'Name must be string and non-empty',
      });
    });
  });

  describe('email', () => {
    it(`given the customer has no account
        when attempting to sign up
        and the email is invalid
        then it should fail`, async () => {
      const sut = await request('http://localhost:3000')
        .post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Gabriel',
          email: 'abc@com',
          password: '123456789',
        });

      expect(sut.status).toBe(400);
      expect(sut.body).toStrictEqual({
        error: 'Email is not a valid email address',
      });
    });

    it(`given the customer has no account
        when attempting to sign up
        and the email is empty
        then it should fail`, async () => {
      const sut = await request('http://localhost:3000')
        .post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Gabriel',
          email: ' ',
          password: '123456789',
        });

      expect(sut.status).toBe(400);
      expect(sut.body).toStrictEqual({
        error: 'Email must be string and non-empty',
      });
    });

    it(`given the customer has no account
        when attempting to sign up
        and the email is null
        then it should fail`, async () => {
      const sut = await request('http://localhost:3000')
        .post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Gabriel',
          email: null,
          password: '123456789',
        });

      expect(sut.status).toBe(400);
      expect(sut.body).toStrictEqual({
        error: 'Email must be string and non-empty',
      });
    });

    it(`given the customer has no account
        when attempting to sign up
        and the email is undefined
        then it should fail`, async () => {
      const sut = await request('http://localhost:3000')
        .post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Gabriel',
          email: undefined,
          password: '123456789',
        });

      expect(sut.status).toBe(400);
      expect(sut.body).toStrictEqual({
        error: 'Email must be string and non-empty',
      });
    });
  });

  describe('password', () => {
    it(`given the customer has no account
        when attempting to sign up
        and the password is invalid
        then it should fail`, async () => {
      const sut = await request('http://localhost:3000')
        .post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Gabriel',
          email: 'gabriel.houth@gmail.com',
          password: '123',
        });

      expect(sut.status).toBe(400);
      expect(sut.body).toStrictEqual({
        error: 'Password must be between 8 and 20 characters',
      });
    });

    it(`given the customer has no account
        when attempting to sign up
        and the password is invalid
        then it should fail`, async () => {
      const sut = await request('http://localhost:3000')
        .post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Gabriel',
          email: 'gabriel.houth@gmail.com',
          password: '123'.repeat(20),
        });

      expect(sut.status).toBe(400);
      expect(sut.body).toStrictEqual({
        error: 'Password must be between 8 and 20 characters',
      });
    });

    it(`given the customer has no account
        when attempting to sign up
        and the password is null
        then it should fail`, async () => {
      const sut = await request('http://localhost:3000')
        .post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Gabriel',
          email: 'gabriel.houth@gmail.com',
          password: null,
        });

      expect(sut.status).toBe(400);
      expect(sut.body).toStrictEqual({
        error: 'Password must be string and non-empty',
      });
    });

    it(`given the customer has no account
        when attempting to sign up
        and the password is undefined
        then it should fail`, async () => {
      const sut = await request('http://localhost:3000')
        .post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Gabriel',
          email: 'gabriel.houth@gmail.com',
          password: undefined,
        });

      expect(sut.status).toBe(400);
      expect(sut.body).toStrictEqual({
        error: 'Password must be string and non-empty',
      });
    });

    it(`given the customer has no account
        when attempting to sign up
        and the password is empty
        then it should fail`, async () => {
      const sut = await request('http://localhost:3000')
        .post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Gabriel',
          email: 'gabriel.houth@gmail.com',
          password: ' ',
        });

      expect(sut.status).toBe(400);
      expect(sut.body).toStrictEqual({
        error: 'Password must be string and non-empty',
      });
    });
  });
});
