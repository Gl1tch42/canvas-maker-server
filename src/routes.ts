import { Router, Response } from 'express';
import userController from './controllers/UserController';
import Validation from './models/Validation';

const routes = Router();

routes.get('/', (_, res:Response) => res.status(204).send());

routes.post('/signup',
	Validation.signup,
	userController.signUp);

routes.post('/signin',
	Validation.signin,
	userController.signIn);

// routes.get('/secret', userController.secret);

export default routes;
