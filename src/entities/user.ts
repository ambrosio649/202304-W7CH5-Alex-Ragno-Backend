// TEMP import { Film } from './film';

export type User = {
  id: string;
  userName: string;
  email: string;
  password: string;
  friends: User[];
  enemies: User[];
  avatar: Avatar;
};

export type UserLogin = {
  user: string; // Equal userName o email
  password: string;
};

type Avatar = {
  urlOriginal: string;
  url: string;
  mimetype: string;
  size: number;
};
