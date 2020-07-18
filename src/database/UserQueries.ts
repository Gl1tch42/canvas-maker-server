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

	public static async createLocalUser(newUserAccount: UserAccount, newUserLocalAuth: UserLocalAuth):Promise<number> {

		const connection = await pool.getConnection();
		let newUserId:number;

		try {

			await connection.beginTransaction();

			const [userAccount, _]:[OkPacket, FieldPacket[]] = await connection.query(
				'INSERT INTO Accounts SET name=?, nickname=?, email=?',
				[newUserAccount.name, newUserAccount.nickname, newUserAccount.email]);

			newUserId = userAccount.insertId;

			await connection.query(
				'INSERT INTO LocalAuth SET AccountsId=?, email=?, password=?',
				[newUserId, newUserLocalAuth.email, newUserLocalAuth.password]);

			await connection.commit();
		}

		catch (error) {
			await connection.rollback();
			throw error;
		}

		finally {
			connection.release();
		}

		return newUserId;
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
