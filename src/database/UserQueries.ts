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
			pool.getConnection((errorPool, connection) => {

				if (errorPool) reject(errorPool);

				connection.beginTransaction(errorTransaction => {

					if (errorTransaction) reject(errorTransaction);

					connection.query(
						'INSERT INTO Accounts SET name=?, nickname=?, email=?',
						[newUserAccount.name, newUserAccount.nickname, newUserAccount.email],
						(errorQuery, results: OkPacket) => {

							if (errorQuery)
								connection.rollback(() => reject(errorQuery));

							const insertedAccountId = results.insertId;

							connection.query(
								'INSERT INTO LocalAuth SET AccountsId=?, email=?, password=?',
								[insertedAccountId, newUserLocalAuth.email, newUserLocalAuth.password],
								errQuery => {

									if (errQuery)
										connection.rollback(() => reject(errQuery));

									connection.commit(err => {

										if (err)
											connection.rollback(() => reject(err));

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
