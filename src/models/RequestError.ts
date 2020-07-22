import { ValidationError } from 'express-validator';

interface Error {
	msg: string
}

export default class RequestError {

	static expressValidatorErrorsMsgCleaner(results: ValidationError[]):Error[] {
		return results.map(error => ({ msg: error.msg }));
	}

	static get missingMethod(): Error[] {
		return [{ msg: 'Method field is missing.' }];
	}

	static get invalidMethod():Error[] {
		return [{ msg: 'Method field is invalid.' }];
	}

	static get userNicknameAlreadyExists(): Error[] {
		return [{ msg: 'A user already exists with this nickname.' }];
	}

	static get userEmailAlreadyExists(): Error[] {
		return [{ msg: 'A user already exists with this email.' }];
	}
}
