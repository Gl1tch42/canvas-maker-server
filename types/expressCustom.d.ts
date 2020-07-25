declare namespace Express {
	export interface Request {
		id?: number
	}
}

declare module 'http' {
	export interface IncomingHttpHeaders {
		refreshToken?: string
	}
}
