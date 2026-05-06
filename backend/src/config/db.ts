import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined');
}

const isAivenOrSslConnection =
  databaseUrl.includes('aivencloud.com') || databaseUrl.includes('ssl-mode=REQUIRED');

export const pool = mysql.createPool({
  uri: databaseUrl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: isAivenOrSslConnection
    ? {
        rejectUnauthorized: false
      }
    : undefined
});

// Connection Test
pool.getConnection()
  .then(conn => {
    console.log('Connected to the MySQL database.');
    conn.release();
  })
  .catch(err => {
    console.error('Error connecting to MySQL:', err);
  });