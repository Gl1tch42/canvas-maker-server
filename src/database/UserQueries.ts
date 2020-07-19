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

interface Account extends RowDataPacket {
	id: number,
	name: string,
	nickname: string,
	email: string,
	pictureName: string,
	createdIn: number,
	lastAccess: number
}

interface LocalAuth extends RowDataPacket {
	AccountsId: number,
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

	public static async findAccountById(accountId:number):Promise<Account|null> {

		const [account, _]:[Account[], FieldPacket[]] = await pool.query(
			'SELECT id FROM Accounts WHERE id = ?', accountId);

		if (account.length > 0)
			return account[0];

		return null;
	}

	public static async findLocalByEmail(userEmail:string):Promise<LocalAuth|null> {

		const [localAuth, _]:[LocalAuth[], FieldPacket[]] = await pool.query(
			'SELECT * FROM LocalAuth WHERE email = ?', userEmail);

		if (localAuth.length > 0)
			return localAuth[0];

		return null;
	}
}
