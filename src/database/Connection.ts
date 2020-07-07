import credentials from '../../secure/database.credentials';
import { createPool } from 'mysql2';

const pool = createPool({

	database: credentials.DATABASE,
	host: credentials.HOST,
	user: credentials.USER,
	password: credentials.PASSWORD,

	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

export default pool.promise();
