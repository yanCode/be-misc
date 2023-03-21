import { Request, Response } from 'express';
import { CreateUserInput } from '../schema/user.schema';
import { createUser } from '../services/user.service';

export async function createUserHandler(
  req: Request<_, _, CreateUserInput>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    return res.send('User successfully Created');
  } catch (e: any) {
    if (e.code === 11000) {
      return res.status(409).send('account alredy exists');
    }
    res.status(500).send(e);
  }
}
