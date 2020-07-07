import { Router, Response } from 'express';
import { signUp } from './controllers/userController';

const routes = Router();

routes.get('/', (_, res:Response) => {
	res.status(204).send();
});

routes.post('/signup', signUp);

export default routes;
