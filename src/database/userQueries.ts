import connection from './Connection';
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2';

export default class UserQueries {

	public static async allUsers():Promise<RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader> {
		const [rows, _] = await connection.query('SELECT * FROM userIdentity');
		return rows;
	}

}

