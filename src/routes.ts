import { Router, Response } from 'express';
import userController from './controllers/UserController';
import { validationChecker } from './controllers/validationController';
import { createLocalUser } from './models/validationsModel';

const routes = Router();

routes.get('/', (_, res:Response) => res.status(204).send());

routes.post('/signup', validationChecker(createLocalUser), userController.signUp);
// routes.post('/signin', userController.signIn);
routes.get('/secret', userController.secret);

export default routes;
