import { ValidationError } from 'express-validator';


export default class RequestError {

	static expressValidatorErrorsMsgCleaner(results: ValidationError[]):string[] {
		return results.map(error => error.msg);
	}

	static get missingMethod():string[] {
		return ['Method field is missing.'];
	}

	static get invalidMethod():string[] {
		return ['Method field is invalid.'];
	}

	static get userNicknameAlreadyExists():string[] {
		return ['A user already exists with this nickname.'];
	}

	static get userEmailAlreadyExists(): string[] {
		return ['A user already exists with this email.'];
	}
}
