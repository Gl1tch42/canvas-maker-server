import { Request, Response, NextFunction } from 'express';
import RequestError from '../models/RequestError';
import jwt from 'jsonwebtoken';


export default class Authentication {

	public static getToken(req: Request, res: Response, next: NextFunction): void {

		const bearesHeader = req.headers.authorization;

		if (typeof bearesHeader === 'undefined') {
			const errors = RequestError.missingAuthHeader;
			res.status(403).json({ errors });
			return;
		}

		const token = bearesHeader.split(' ')[1];

		req.token = token;

		next();
	}
}
