import { Router, Request, Response, NextFunction } from 'express';
import { UserStore } from './store';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { omit } from 'lodash';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const router = Router({ mergeParams: true });
const store = new UserStore();

router.post('/login', async (req: Request, res: Response) => {
  const user = await store.findByEmail(req.body.email);

  if (!user) {
    return res.status(400).send('Cannot find user');
  }

  try {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const accessToken = jwt.sign(
        omit(user, 'password'),
        process.env.ACCESS_TOKEN_SECRET as string,
      );
      res.json({ accessToken });
    } else {
      res.send('Not Allowed');
    }
  } catch {
    res.status(500).send();
  }
});

router.post('/register', async (req: Request, res: Response) => {
  // validate request
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  try {
    schema.parse(req.body);
  } catch (e) {
    return res.status(400).send('Invalid request');
  }

  try {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    const newUser = await store.create(user);

    res.json(newUser);
  } catch (e) {
    res.status(500).send();
  }
});

// Middleware to authenticate JWT
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
    if (err) return res.sendStatus(403);

    (req as any).user = user;
    next();
  });
}

export { router as userRouter, authenticateToken };
