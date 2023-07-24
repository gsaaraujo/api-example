import { Request, Response, Router } from 'express';

import { expressSignupController } from '@/auth/main/dependencies';

export const router = Router();

router.post('/auth/sign-up', async (request: Request, response: Response) => {
  return expressSignupController.handle(request, response);
});
