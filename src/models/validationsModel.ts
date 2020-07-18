import { body } from 'express-validator';

export const createLocalUser = [
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

export const loginLocalUser = [

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
