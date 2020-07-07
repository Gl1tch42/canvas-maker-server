import { Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

export const validationChecker = (validations: ValidationChain[]) =>
	async (req: Request, res: Response, next: NextFunction):Promise<unknown> => {
		await Promise.all(validations.map(validation => validation.run(req)));

		const errors = validationResult(req);
		if (errors.isEmpty()) {
			return next();
		}

		res.status(422).json({ errors: errors.array() });
	};

export default validationChecker;
