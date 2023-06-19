import createDebug from 'debug';
import { User } from '../entities/user.js';
import { Repo } from './repo.js';
import { UserModel } from './user.mongo.model.js';
import { HttpError } from '../types/http.error.js';

const debug = createDebug('W6:UserRepo');

export class UserRepo implements Repo<User> {
  constructor() {
    debug('Instantiate', UserModel);
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<User[]> {
    const result = await UserModel.find({ [key]: value })
      .populate('friends', { id: 0, friends: 0, enemies: 0 })
      .populate('enemies', { id: 0, friends: 0, enemies: 0 })
      .exec();
    return result;
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    const newUser = await UserModel.create(data);
    return newUser;
  }

  async query(): Promise<User[]> {
    const currentData = await UserModel.find()
      .populate('friends', { id: 0, friends: 0, enemies: 0 })
      .populate('enemies', { id: 0, friends: 0, enemies: 0 })
      .exec();

    return currentData;
  }

  async queryById(id: string): Promise<User> {
    const result = await UserModel.findById(id)
      .populate('friends', { id: 0, friends: 0, enemies: 0 })
      .populate('enemies', { id: 0, friends: 0, enemies: 0 })
      .exec();

    if (result === null)
      throw new HttpError(404, 'Not found', 'Bad id for the query');

    return result;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const newUser = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate('friends', { id: 0 })
      .populate('enemies', { id: 0 })
      .exec();

    if (newUser === null)
      throw new HttpError(404, 'Not found', 'Bad id for the update');

    return newUser;
  }

  async delete(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id).exec();

    if (result === null)
      throw new HttpError(404, 'Not found', 'Bad id for the delete');
  }
}
