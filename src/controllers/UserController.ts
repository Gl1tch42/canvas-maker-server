import dotenv from 'dotenv';
import { Request, Response } from 'express';
import UserQueries from '../database/UserQueries';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import RequestError from '../models/RequestError';

dotenv.config({ path: 'secure/.env' });


export default class UserController {

	private static genAccessToken(userId:number):string {
		return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
			expiresIn: '15m'
		});
	}

	private static genRefreshToken(userId:number):string {
		const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!);

		return refreshToken;
	}

	public static async signUp (req: Request, res: Response): Promise<Response> {

		try {
			const userName: string = req.body.name;
			const userNickname: string = req.body.nickname;
			const userEmail: string = req.body.email;
			const userHashedPassword: string = await bcrypt.hash(req.body.password, Number(process.env.BCRYPT_SALT_ROUNDS!));

			const userId = await UserQueries.createLocalUser(userName, userNickname, userEmail, userHashedPassword);


			const accessToken = UserController.genAccessToken(userId);
			const refreshToken = UserController.genRefreshToken(userId);

			return res.status(200).json({ accessToken, refreshToken });
		}
		catch (error) {
			console.log(error);
			return res.sendStatus(500);
		}
	}


	public static async signIn(req: Request, res: Response): Promise<Response> {

		try {
			const localUser = await UserQueries.findLocalByEmail(req.body.email);

			if (!localUser)
				return res.status(404).json({ 'errors': RequestError.userDoesNotExist });


			const isPasswordRight = await bcrypt.compare(req.body.password, localUser.password);

			if (!isPasswordRight)
				return res.status(401).json({ 'errors': RequestError.incorrectPassword });


			const accessToken = UserController.genAccessToken(localUser.AccountsId);
			const refreshToken = UserController.genRefreshToken(localUser.AccountsId);

			return res.status(200).json({ accessToken, refreshToken });
		}
		catch (error) {
			console.log(error);
			return res.sendStatus(500);
		}
	}

	// public static secret(req: Request, res: Response): Response {

	//	return res.status(200).json({ msg: 'I got here.' });
	// }
}
