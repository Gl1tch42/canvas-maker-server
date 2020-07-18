import pool from './Connection';
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql2';

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

	public static async createLocalUser(newUserAccount: UserAccount, newUserLocalAuth: UserLocalAuth):Promise<void> {

		const connection = await pool.getConnection();

		try {

			await connection.beginTransaction();

			const [userAccount, _]:[OkPacket, FieldPacket[]] = await connection.query(
				'INSERT INTO Accounts SET name=?, nickname=?, email=?',
				[newUserAccount.name, newUserAccount.nickname, newUserAccount.email]);

			const insertedAccountId = userAccount.insertId;

			await connection.query(
				'INSERT INTO LocalAuth SET AccountsId=?, email=?, password=?',
				[insertedAccountId, newUserLocalAuth.email, newUserLocalAuth.password]);

			await connection.commit();
		}

		catch (error) {
			await connection.rollback();
			throw error;
		}

		finally {
			connection.release();
		}
	}

	public static async canFindUser(newUser:UserAccount):Promise<boolean> {

		const [foundUsers, _]:[RowDataPacket[], FieldPacket[]] = await pool.query(
			'SELECT * FROM Accounts WHERE nickname = ? OR email = ?',
			[newUser.nickname, newUser.email]);

		if (foundUsers.length > 0)
			return true;

		return false;
	}
}
