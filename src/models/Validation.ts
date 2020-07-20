import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

export default class Validation {

	public static async signup(req: Request, res: Response, next: NextFunction):Promise<void> {

		const method = req.body.method;

		if (!method) {
			res.status(400).json({ error: 'Method field is missing.' });
			return;
		}

		let validations: ValidationChain[];

		switch (method) {
			case 'local':
			default:
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
						.withMessage('Email field is invalid.'),

					body('password')
						.exists()
						.withMessage('Password field missing.')
						.if(body('password').exists())
						.isLength({ min: 7 })
						.withMessage('Password field is invalid. Password should be at least 7 characters long.')
				];
		}

		await Promise.all(validations.map(validation => validation.run(req)));

		const errors = validationResult(req);
		if (errors.isEmpty()) {
			return next();
		}

		res.status(400).json({ errors: errors.array() });
	}


	public static async signin(req: Request, res: Response, next: NextFunction):Promise<void> {

		const method = req.body.method;

		if (!method) {
			res.status(400).json({ error: 'Method field is missing.' });
			return;
		}

		let validations: ValidationChain[];

		switch (method) {
			case 'local':
			default:
				validations = [
					body('email')
						.exists()
						.withMessage('Email field missing.')
						.if(body('email').exists())
						.trim()
						.isEmail()
						.normalizeEmail()
						.withMessage('Email field is invalid.'),

					body('password')
						.exists()
						.withMessage('Password field missing.')
						.if(body('password').exists())
						.isLength({ min: 7 })
						.withMessage('Password field is invalid. Password should be at least 7 characters long.')
				];
		}

		await Promise.all(validations.map(validation => validation.run(req)));

		const errors = validationResult(req);
		if (errors.isEmpty()) {
			return next();
		}

		res.status(400).json({ errors: errors.array() });
	}

}

