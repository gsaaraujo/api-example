import express from 'express';

import { router } from '@/auth/main/routes';

const server = async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(router);

  app.listen(3000, () => {
    console.log(`Example app listening on port ${3000}`);
  });
};

server();
