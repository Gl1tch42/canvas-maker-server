import connection from './Connection';
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2';

interface User {
	name: string,
	nickname: string,
	email: string,
	password: string
}

export default class UserQueries {

	public static async allUsers():Promise<RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader> {
		const [rows, _] = await connection.query('SELECT * FROM Accounts');
		return rows;
	}

}
