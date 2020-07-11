/* eslint-disable no-mixed-spaces-and-tabs */
import { Request, Response } from 'express';
import UserQueries from '../database/userQueries';
// import connection from '../database/Connection';

export = {

	signUp: async (req: Request, res: Response): Promise<Response> => {

		 const users = await UserQueries.allUsers();

		return res.status(200).json({ saldjflkasjd: users });
	},
}
