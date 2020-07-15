import dotenv from 'dotenv';
import { Request, Response } from 'express';
import UserQueries from '../database/UserQueries';
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

		return res.status(200).json({ saldjflkasjd: users });
	}

	// public static async signIn(req: Request, res: Response): Promise<Response> {

	//	jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

	//	return res.status(200).json({ user });
	// }

	public static async secret (req: Request, res: Response): Promise<Response> {

		await console.log('Secret reveled');
		return res.status(200).send({ secret: 'asdfasdf' });
	}
}
