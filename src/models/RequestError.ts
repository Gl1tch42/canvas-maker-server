interface Error {
	msg: string
}

export default class RequestError {

	static get missingMethod(): Error {
		return { msg: 'Method field is missing.' };
	}

	static invalidMethod():Error {
		return { msg: 'Method field is invalid.' };
	}

	static userNicknameAlreadyExists(): Error {
		return { msg: 'A user already exists with this nickname.' };
	}

	static userEmailAlreadyExists(): Error {
		return { msg: 'A user already exists with this email.' };
	}
}
