import dotenv from 'dotenv';
import { Request, Response } from 'express';
import UserQueries from '../database/UserQueries';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config({ path: 'secure/.env' });


export default class UserController {

	private static signToken(userId:number):string {
		return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
			issuer: 'Canvas Maker',
			expiresIn: '15m'
		});
	}

	public static async signUp (req: Request, res: Response): Promise<Response> {

		try {
			const userName: string = req.body.name;
			const userNickname: string = req.body.nickname;
			const userEmail: string = req.body.email;
			const userHashedPassword: string = await bcrypt.hash(req.body.password, Number(process.env.BCRYPT_SALT_ROUNDS!));

			const userId = await UserQueries.createLocalUser(userName, userNickname, userEmail, userHashedPassword);


			const token = UserController.signToken(userId);

			return res.status(200).json({ token });
		}
		catch (error) {
			console.log(error);
			return res.status(500).send();
		}
	}

	public static async signIn(req: Request, res: Response): Promise<Response> {

		try {
			const localUser = await UserQueries.findLocalByEmail(req.body.email);

			if (!localUser)
				return res.status(404).send('User does not exist.');


			const match = await bcrypt.compare(req.body.password, localUser.password);

			if (!match)
				return res.status(401).send('Incorrect password.');


			const token = UserController.signToken(localUser.AccountsId);
			return res.status(200).json({ token });
		}
		catch (error) {
			console.log(error);
			return res.status(500).send();
		}
	}

	// public static secret(req: Request, res: Response): Response {

	//	return res.status(200).json({ msg: 'I got here.' });
	// }
}
