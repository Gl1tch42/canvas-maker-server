import pool from './Connection';
import { OkPacket } from 'mysql2';

interface UserAccount {
	name: string,
	nickname: string,
	email: string
}

interface UserLocalAuth {
	email: string,
	password: string
}

export default class UserQueries {

	public static async createLocalUser(newUser:UserAccount):Promise<RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader> {

		return await new Promise((resolve, reject) => {
			connection.query(
				'SELECT * FROM Accounts',
				(error, result) => {
					if (error)
						return reject(error);

					return resolve(result);
				}
			);
		});
	}

	public static async lookForUser(newUser:UserAccount):Promise<boolean> {

		return await new Promise((resolve, reject) => {
			pool.query(
				'SELECT * FROM Accounts WHERE nickname = ? OR email = ?',
				[newUser.nickname, newUser.email],
				(error, result) => {

					if (error)
						return reject(error);

					if (Array.isArray(result) && result.length > 0)
						return resolve(true);

					return resolve(false);
				}
			);
		});
	}
}
