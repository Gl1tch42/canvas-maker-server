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

			const newUserId = await UserQueries.createLocalUser(newUserAccount, newUserLocalAuth);

			await jwt.sign({
				iss: 'Canvas Maker',
				sub: newUserId
			}, '', {
				expiresIn: '1d'
			});

			return res.status(200).json({ newUserLocalAuth });
		}
		catch (error) {
			return res.status(500).json({ error });
		}
	}
}
