import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import RequestError from '../models/RequestError';
import jwt from 'jsonwebtoken';

dotenv.config({ path: 'secure/.env' });

interface Token {
	userId: number,
	iat: number,
	exp: number,
	iss: string
}

export default class Authentication {

	public static getToken(req: Request, res: Response, next: NextFunction): void {

		const bearesHeader = req.headers.authorization;

		if (typeof bearesHeader === 'undefined') {
			const errors = RequestError.missingAuthHeader;
			res.status(403).json({ errors });
			return;
		}

		const token = bearesHeader.split(' ')[1];

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (error, authData) => {
			if (error) {
				console.log(error);
				res.sendStatus(403);
				return;
			}

			const varifiedToken = <Token>authData;

			req.id = varifiedToken.userId;

			next();
		});
	}
}
