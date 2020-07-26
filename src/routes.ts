import { Router, Response } from 'express';
import userController from './controllers/UserController';
import Validation from './models/Validation';
import authController from './controllers/AuthContoller';


const routes = Router();

routes.get('/', (_, res:Response) => res.status(204).send());

routes.post('/signup',
	Validation.signup,
	userController.signUp);

routes.post('/signin',
	Validation.signin,
	userController.signIn);

routes.post('/token', authController.refreshToken);

export default routes;
