import { body } from 'express-validator';

export const localAuth = [
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
		.withMessage('Password field is invalid. Password should be at least 7 characters long.'),
];
