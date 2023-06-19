import { Router as createRouter } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { Repo } from '../repository/repo.js';
import { User } from '../entities/user.js';
import { UserRepo } from '../repository/user.mongo.repository.js';
import createDebug from 'debug';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FileMiddleware } from '../middleware/files.js';
const debug = createDebug('W6:UserRouter');

debug('Executed');
const repo: Repo<User> = new UserRepo() as Repo<User>;
const controller = new UserController(repo);
export const userRouter = createRouter();
const interceptor = new AuthInterceptor(repo);
const fileStore = new FileMiddleware();

userRouter.get('/', controller.getAll.bind(controller));
userRouter.post(
  '/register',
  fileStore.singleFileStore('avatar').bind(fileStore),
  fileStore.saveImage.bind(fileStore),
  controller.register.bind(controller)
);
userRouter.patch('/login', controller.login.bind(controller));
userRouter.get('/friends', controller.getAll.bind(controller));
userRouter.get('/enemies', controller.getAll.bind(controller));
userRouter.patch(
  '/update/:id',
  interceptor.logged.bind(interceptor),
  controller.patch.bind(controller)
);
userRouter.patch(
  '/addfriends/:id',
  interceptor.logged.bind(interceptor),
  controller.addFriendOrEnemy.bind(controller)
);
userRouter.patch(
  '/addenemies/:id',
  interceptor.logged.bind(interceptor),
  controller.addFriendOrEnemy.bind(controller)
);
