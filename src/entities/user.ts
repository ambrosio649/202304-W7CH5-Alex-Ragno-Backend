// TEMP import { Film } from './film';

export type User = {
  id: string;
  userName: string;
  email: string;
  password: string;
  friends: User[];
  enemies: User[];
};

export type UserLogin = {
  user: string; // Equal userName o email
  password: string;
};
