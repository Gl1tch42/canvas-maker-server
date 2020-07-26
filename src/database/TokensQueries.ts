import pool from './Connection';


export default class TokensQueries {

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
