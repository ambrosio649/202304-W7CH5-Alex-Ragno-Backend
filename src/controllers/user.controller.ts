import { NextFunction, Request, Response } from 'express';
import { UserRepo } from '../repository/user.mongo.repository.js';
import AuthServices, { PayloadToken } from '../services/auth.js';
import { HttpError } from '../types/http.error.js';
import { LoginResponse } from '../types/response.api.js';

import createDebug from 'debug';
import { Controller } from './controller.js';
import { User } from '../entities/user.js';
const debug = createDebug('W6:UserController');

export class UserController extends Controller<User> {
  // eslint-disable-next-line no-unused-vars
  constructor(protected repo: UserRepo) {
    super();
    debug('Instantiated');
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const password = await AuthServices.hash(req.body.password);
      req.body.password = password;

      res.status(201);
      res.send(await this.repo.create(req.body));
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.user || !req.body.password)
        throw new HttpError(400, 'Bad request', 'User or password invalid (1)');

      let data = await this.repo.search({
        key: 'userName',
        value: req.body.user,
      });
      if (!data.length) {
        data = await this.repo.search({
          key: 'email',
          value: req.body.user,
        });
      }

      if (!data.length) {
        throw new HttpError(400, 'Bad request', 'User or password invalid (2)');
      }

      const isUserValid = await AuthServices.compare(
        req.body.password,
        data[0].password
      );

      if (!isUserValid) {
        throw new HttpError(400, 'Bad request', 'User or password invalid (3)');
      }

      const payload: PayloadToken = {
        id: data[0].id,
        userName: data[0].userName,
      };
      const token = AuthServices.createJWT(payload);
      const response: LoginResponse = {
        token,
        user: data[0],
      };

      res.send(response);

      debug('User logged');
    } catch (error) {
      next(error);
    }
  }

  async addFriendOrEnemy(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.body.tokenPayload as PayloadToken;
      const user = await this.repo.queryById(userId);
      delete req.body.tokenPayload;
      const newUser = await this.repo.queryById(req.params.id);

      if (req.path.includes('friend')) {
        if (userId === '648de4c68adfd51807f6a24e')
          throw new HttpError(409, 'Conflict', 'Cannot add friends');
        user.friends.push(newUser);
        await this.repo.update(userId, user);
        await this.repo.update(req.params.id, newUser);
        res.status(201);
        res.send(user);
      }

      if (req.path.includes('enemies')) {
        user.enemies.push(newUser);
        await this.repo.update(userId, user);
        await this.repo.update(req.params.id, newUser);
        res.status(201);
        res.send(user);
      }
    } catch (error) {
      next(error);
    }
  }
}
