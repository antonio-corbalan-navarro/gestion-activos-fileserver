import { Router } from 'express';
import { readdirSync } from 'fs';

const PATH_ROUTER = `${__dirname}`;

const routerV1 = Router();

const clearFilename = (filename: string) => {
  const file = filename.split('.').shift();
  return file;
};

readdirSync(PATH_ROUTER).filter((filename) => {
  const cleanName = clearFilename(filename);
  if (cleanName !== 'index' && cleanName !== 'auth') {
    import(`./${cleanName}`).then((moduleRouter) => {
      console.log(`Loading route /${cleanName}`);
      routerV1.use(`/${cleanName}`, moduleRouter.routerV1);
    }).then(() => console.log(`/v1/api/${cleanName} available`));
  }
});

export { routerV1 };
