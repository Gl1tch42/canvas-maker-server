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
		return jwt.sign({
			iss: 'Canvas Maker',
			sub: userId,
			exp: '15m'
		}, process.env.ACCESS_TOKEN_SECRET!);
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

			const userId = await UserQueries.createLocalUser(newUserAccount, newUserLocalAuth);

			const token = UserController.signToken(userId);

			return res.status(200).json({ token });
		}
		catch (error) {
			return res.status(500).json({ error });
		}
	}

	public static async signIn(req: Request, res: Response): Promise<Response> {

		try {
			const localUser = await UserQueries.findLocalByEmail(req.body.email);

			if (!localUser)
				return res.status(404).send('User does not exist.');

			const match = await bcrypt.compare(req.body.password, localUser.password);


			if (match) {
				const token = UserController.signToken(localUser.AccountsId);
				return res.status(200).json({ token });
			}

			return res.status(401).send('Incorrect password.');
		}
		catch (error) {
			return res.status(500).json(error);
		}
	}

	// public static secret(req: Request, res: Response): Response {

	//	return res.status(200).json({ msg: 'I got here.' });
	// }
}
