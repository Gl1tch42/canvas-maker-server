import { Router } from 'express';

const routes = Router();

routes.get('/', (_, res:Response) => {
	res.status(204).send();
});

export default routes;
