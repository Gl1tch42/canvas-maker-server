import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import UserQueries from '../database/UserQueries';
import RequestError from './RequestError';


export default class Validation {

	private static async validateRequest(req:Request, res:Response, validations: ValidationChain[]):Promise<boolean> {

		await Promise.all(validations.map(validation => validation.run(req)));

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ 'errors': errors.array() });
			return false;
		}

		return true;
	}


	private static getRequestMethod(req: Request, res: Response): string|void {
		const method = req.body.method;

		if (method)
			return method;

		res.status(400).json({ 'errors': [RequestError.missingMethod] });
	}


	public static async signup(req: Request, res: Response, next: NextFunction):Promise<void> {

		const method = Validation.getRequestMethod(req, res);
		if (!method) return;


		let validations: ValidationChain[];

		if (method === 'local') {
			validations = [
				body('name').exists().withMessage('Name field missing.').trim(),

				body('nickname').exists().withMessage('Nickname field missing.').trim(),

				body('email').exists().withMessage('Email field missing.')
					.if(body('email').exists())
					.trim().isEmail()
					.normalizeEmail().withMessage('Email format is incorrect.'),

				body('password').exists().withMessage('Password field missing.')
					.if(body('password').exists())
					.isLength({ min: 7 }).withMessage('Password should be at least 7 characters long.')
			];
		}
		else {
			res.status(400).json({ 'errors': [RequestError.invalidMethod] });
			return;
		}


		const isValidRequest = await Validation.validateRequest(req, res, validations);
		if (!isValidRequest)
			return;


		const existingUserAccount = await UserQueries.findAccountByNickOrEmail(req.body.nickname, req.body.email);

		if (existingUserAccount) {

			const errors = [];

			if (existingUserAccount.nickname === req.body.nickname) {
				errors.push(RequestError.userNicknameAlreadyExists);
			}

			if (existingUserAccount.email === req.body.email) {
				errors.push(RequestError.userEmailAlreadyExists);
			}

			res.status(403).json({ errors });

			return;
		}

		next();
	}


	public static async signin(req: Request, res: Response, next: NextFunction):Promise<void> {

		const method = Validation.getRequestMethod(req, res);
		if (!method) return;

		let validations: ValidationChain[];

		if (method === 'local') {
			validations = [
				body('email').exists().withMessage('Email field missing.')
					.if(body('email').exists())
					.trim().isEmail().normalizeEmail().withMessage('Email format is incorrect.'),

				body('password').exists().withMessage('Password field missing.')
					.if(body('password').exists())
					.isLength({ min: 7 }).withMessage('Password should be at least 7 characters long.')
			];
		}
		else {
			res.status(400).json({ 'errors': [RequestError.invalidMethod] });
			return;
		}

		const isValidRequest = await Validation.validateRequest(req, res, validations);
		if (!isValidRequest)
			return;

		next();
	}

}

