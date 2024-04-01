import { Response } from 'express';
// Create a real ErrorHandler equisde.

const handleHttp = (res: Response, error: any) => {
  res.status(500);
  res.send({ error });
};

export { handleHttp };
