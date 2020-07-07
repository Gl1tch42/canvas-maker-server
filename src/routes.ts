import { Router, Response } from 'express';
import userController from './controllers/userController';
import { validationChecker } from './controllers/validationController';
import { localAuth } from './models/validationsModel';

const routes = Router();

routes.get('/', (_, res:Response) => res.status(204).send());

routes.post('/signup', validationChecker(localAuth), userController.signUp);
routes.get('/signin');

export default routes;
