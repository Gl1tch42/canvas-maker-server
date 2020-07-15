import connection from './Connection';
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2';

interface UserAccount {
	name: string,
	nickname: string,
	email: string
}

interface UserLocalAuth {
	AccountsId: number,
	email: string,
	password: string
}

export default class UserQueries {

	public static async allUsers():Promise<RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader> {
		const [rows, _] = await connection.query('SELECT * FROM Accounts');
		return rows;
	}

	public static async lookForUser(newUser:User):Promise<boolean> {

		return await new Promise((resolve, reject) => {
			connection.query(
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
