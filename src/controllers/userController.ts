/* eslint-disable no-mixed-spaces-and-tabs */
import { Request, Response } from 'express';

export = {

	signUp: async (req: Request, res: Response): Promise<Response> => {

    	await console.log('UsersController.signUp() called.');
    	return res.status(200).json({ body: req.body });
	},
}
