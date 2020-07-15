import dotenv from 'dotenv';
import { Request, Response } from 'express';
import UserQueries from '../database/UserQueries';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

dotenv.config({ path: 'secure/.env' });

interface User {
	name: string,
	nickname: string,
	email: string,
	password: string,
}

export default class UserController {

	public static async signUp (req: Request, res: Response): Promise<Response> {

		const newUser:User = {
			name: req.body.name,
			nickname: req.body.nickname,
			email: req.body.email,
			password: req.body.password
		};

		try {
			const doesUserExist = await UserQueries.lookForUser(newUser);

			if (doesUserExist)
				return res.status(403).json({ 'Message': 'User already exist.' });


			return res.status(200).json({ doesUserExist });
		}
		catch (error) {

			return res.status(500).json({ error });
		}
	}
}
