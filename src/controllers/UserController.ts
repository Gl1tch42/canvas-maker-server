import dotenv from 'dotenv';
import { Request, Response } from 'express';
import UserQueries from '../database/UserQueries';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config({ path: 'secure/.env' });

interface UserAccount {
	name: string,
	nickname: string,
	email: string
}

interface UserLocalAuth {
	email: string,
	password: string
}

export default class UserController {

	private static signToken(userId:number):string {
		return jwt.sign({ userId },
			process.env.JWT_SECRET_KEY!,
			{
				issuer: 'Canvas Maker',
				expiresIn: '15m'
			}
		);
	}

	public static async signUp (req: Request, res: Response): Promise<Response> {

		try {

			const newUserAccount: UserAccount = {
				name: req.body.name,
				nickname: req.body.nickname,
				email: req.body.email
			};

			const newUserLocalAuth: UserLocalAuth = {
				email: req.body.email,
				password: await bcrypt.hash(req.body.password, Number(process.env.BCRYPT_SALT_ROUNDS!))
			};

			const doesUserExist = await UserQueries.canFindUser(newUserAccount);

			if (doesUserExist)
				return res.status(403).json({ 'Message': 'User already exist.' });

			const userId = await UserQueries.createLocalUser(newUserAccount, newUserLocalAuth);

			const token = UserController.signToken(userId);

			return res.status(200).json({ token });
		}
		catch (error) {
			return res.status(500).json({ error });
		}
	}
}
