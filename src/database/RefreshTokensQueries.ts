import pool from './Connection';
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql2';


interface RefreshTokens extends RowDataPacket {
	id?: number,
	AccountsId: number,
	refreshToken: string,
}

export default class UserQueries {

	public static async addRefreshToken(AccountsId:number, refreshToken:string):Promise<void> {

		await pool.query(
			'INSERT INTO RefreshTokens SET AccountsId=?, refreshToken=?',
			[AccountsId, refreshToken]);
	}


	public static async removeRefreshToken(AccountsId:number, refreshToken:string):Promise<void> {

		await pool.query(
			'DELETE FROM RefreshTokens WHERE AccountsId=? AND refreshToken=?',
			[AccountsId, refreshToken]);
	}
}
