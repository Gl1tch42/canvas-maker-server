import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import UserQueries from '../database/UserQueries';

export default class Validation {

	private static async validateRequest(req:Request, res:Response, validations: ValidationChain[]):Promise<boolean> {

		await Promise.all(validations.map(validation => validation.run(req)));

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return false;
		}

		return true;
	}

		const method = req.body.method;

		if (!method) {
			res.status(400).json({ error: 'Method field is missing.' });
			return;
		}

		let validations: ValidationChain[];

		if (method === 'local') {
			validations = [
				body('name')
					.exists()
					.withMessage('Name field missing.')
					.trim(),

				body('nickname')
					.exists()
					.withMessage('Nickname field missing.')
					.trim(),

				body('email')
					.exists()
					.withMessage('Email field missing.')
					.if(body('email').exists())
					.trim()
					.isEmail()
					.normalizeEmail()
					.withMessage('Email field is invalid. Email format is incorrect.'),

				body('password')
					.exists()
					.withMessage('Password field missing.')
					.if(body('password').exists())
					.isLength({ min: 7 })
					.withMessage('Password field is invalid. Password should be at least 7 characters long.')
			];
		}
		else {
			throw new Error('Invalid method.');
		}

		await Promise.all(validations.map(validation => validation.run(req)));

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}

		const isUserNew = await UserQueries.isUserNew(req.body.nickname, req.body.email);

		if (!isUserNew) {
			res.status(403).json({ 'Message': 'User already exist.' });
			return;
		}

		next();
	}

	public static async signin(req: Request, res: Response, next: NextFunction):Promise<void> {

		const method = req.body.method;

		if (!method) {
			res.status(400).json({ error: 'Method field is missing.' });
			return;
		}

		let validations: ValidationChain[];

		if (method === 'local') {
			validations = [
				body('email')
					.exists()
					.withMessage('Email field missing.')
					.if(body('email').exists())
					.trim()
					.isEmail()
					.normalizeEmail()
					.withMessage('Email field is invalid. Email format is incorrect.'),

				body('password')
					.exists()
					.withMessage('Password field missing.')
					.if(body('password').exists())
					.isLength({ min: 7 })
					.withMessage('Password field is invalid. Password should be at least 7 characters long.')
			];
		}
		else {
			throw new Error('Invalid method.');
		}

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}

		next();
	}

}

