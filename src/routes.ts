import { Router, Response } from 'express';

const routes = Router();

routes.get('/', (_, res:Response) => {
	res.status(204).send();
});

routes.post('/signup', async (req:Request, res:Response) => {
	await console.log('UsersController.signUp() called.');

	return res.status(200).json({ body: req.body });
});

export default routes;
