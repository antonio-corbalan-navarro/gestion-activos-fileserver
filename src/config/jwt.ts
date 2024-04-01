import jwt from 'jsonwebtoken';

const createToken = (id: string, token: string): string => {
  return jwt.sign({ id }, token);
};

export { createToken };
