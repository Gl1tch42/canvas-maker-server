import dotenv from 'dotenv';
import { createPool } from 'mysql2';

dotenv.config({ path: 'secure/.env' });

const pool = createPool({

	database: 'canvasMaker',
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,

	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

export default pool;
