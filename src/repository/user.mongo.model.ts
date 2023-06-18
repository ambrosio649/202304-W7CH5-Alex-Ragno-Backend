import { Schema, model } from 'mongoose';
import { User } from '../entities/user.js';

const UserSchema = new Schema<User>({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  enemies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

UserSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

export const UserModel = model('User', UserSchema, 'users');
