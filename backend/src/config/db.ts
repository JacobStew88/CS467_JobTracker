import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

console.log("DATABASE_URL:", process.env.DATABASE_URL);

// mysql2 can parse your DATABASE_URL string directly
export const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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