import mongoose from 'mongoose';
import { db, password, user } from '../config.js';

export const dbConnect = () => {
  const uri = `mongodb+srv://${user}:${password}@cluster0.s2jmy78.mongodb.net/${db}?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};
