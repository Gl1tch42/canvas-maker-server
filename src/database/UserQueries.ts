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

	public static createLocalUser(newUserAccount: UserAccount, newUserLocalAuth: UserLocalAuth):Promise<void> {

		return new Promise((resolve, reject) => {
			pool.getConnection((error, connection) => {

				if (error) reject(error);

				connection.beginTransaction(error => {

					if (error) reject(error);

					connection.query(
						'INSERT INTO Accounts SET name=?, nickname=?, email=?',
						[newUserAccount.name, newUserAccount.nickname, newUserAccount.email],
						(error, results: OkPacket) => {

							if (error) {
								return connection.rollback(() => {
									reject(error);
								});
							}

							const insertedAccountId = results.insertId;

							connection.query(
								'INSERT INTO LocalAuth SET AccountsId=?, email=?, password=?',
								[insertedAccountId, newUserLocalAuth.email, newUserLocalAuth.password],
								error => {
									if (error) {
										return pool.rollback(() => {
											reject(error);
										});
									}

									connection.commit(error => {
										if (error) {
											return connection.rollback(() => {
												reject(error);
											});
										}
										resolve();
									});
								}
							);
						}
					);
				});
			});
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
