import pool from './Connection';
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql2';


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

	public static async createLocalUser(name:string, nickname:string, email:string, password: string):Promise<number> {

		const connection = await pool.getConnection();
		let newUserId:number;

		try {

			await connection.beginTransaction();

			const [userAccount, _]:[OkPacket, FieldPacket[]] = await connection.query(
				'INSERT INTO Accounts SET name=?, nickname=?, email=?',
				[name, nickname, email]);

			newUserId = userAccount.insertId;

			await connection.query(
				'INSERT INTO LocalAuth SET AccountsId=?, email=?, password=?',
				[newUserId, email, password]);

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

	public static async isUserNew(nickname:string, email:string):Promise<boolean> {

		const [foundUsers, _]:[RowDataPacket[], FieldPacket[]] = await pool.query(
			'SELECT * FROM Accounts WHERE nickname = ? OR email = ?',
			[nickname, email]);

		if (foundUsers.length > 0)
			return false;

		return true;
	}

	public static async findAccountById(accountId:number):Promise<Account|null> {

		const [account, _]:[Account[], FieldPacket[]] = await pool.query(
			'SELECT id FROM Accounts WHERE id = ?', accountId);

		if (account.length > 0)
			return account[0];

		return null;
	}

	public static async findLocalByEmail(email:string):Promise<LocalAuth|null> {

		const [localAuth, _]:[LocalAuth[], FieldPacket[]] = await pool.query(
			'SELECT * FROM LocalAuth WHERE email = ?', email);

		if (localAuth.length > 0)
			return localAuth[0];

		return null;
	}
}
