import { pool } from '../config/db.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// User interfaces
export interface User extends RowDataPacket {
    user_id: number;
    username: string;
    email: string;
    password_hash: string;
}

export interface PublicUser extends RowDataPacket {
    user_id: number;
    username: string;
    email: string;
}

// Omit the auto-incremented ID for creations
export type NewUser = Omit<User, 'user_id'>;

const USERSTABLE: string = 'Users';

/* -- CRUD QUERIES FOR USERS: -- */
// Create a new user
export const createUser = async (user: NewUser): Promise<PublicUser['user_id']> => {
    const [content] = await pool.query<ResultSetHeader>(
        `INSERT INTO ${USERSTABLE} (username, email, password_hash) VALUES (?, ?, ?)`,
        [user.username, user.email, user.password_hash]
    );
    return content.insertId as PublicUser['user_id']; 
};

// Get a user
export const getUser = async (user_id: User['user_id']): Promise<PublicUser | null> => {
    const [content] = await pool.query<PublicUser[]>(
        `SELECT user_id, username, email FROM ${USERSTABLE} WHERE user_id = ?`, 
        [user_id]
    );
    return content.length > 0 ? content[0] : null;
}   

// Get a user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
    const [content] = await pool.query<User[]>(
        `SELECT * FROM ${USERSTABLE} WHERE email = ?`, 
        [email]
    );
    return content.length > 0 ? content[0] : null;
};

// Get a user by username
export const getUserByUsername = async (username: string): Promise<User | null> => {
    const [content] = await pool.query<User[]>(
        `SELECT * FROM ${USERSTABLE} WHERE username = ?`, 
        [username]
    );
    return content.length > 0 ? content[0] : null;
};

// Get a user by ID
export const getUserById = async (user_id: User['user_id']): Promise<User | null> => {
    const [content] = await pool.query<User[]>(
        `SELECT * FROM ${USERSTABLE} WHERE user_id = ?`, 
        [user_id]
    );
    return content.length > 0 ? content[0] : null;
};

// Update a user
export const updateUser = async (user: PublicUser): Promise<boolean> => {
    const [content] = await pool.query<ResultSetHeader>(
        `UPDATE ${USERSTABLE} SET username = ?, email = ? WHERE user_id = ?`,
        [user.username, user.email, user.user_id]
    );
    return content.affectedRows > 0;
}

// Get user's hashed password -- NOTE: FOR BACKEND VERIFICATION ONLY --
export const getUserPasswordHash = async (user_id: number): Promise<string | null> => {
    const [content] = await pool.query<RowDataPacket[]>(
        `SELECT password_hash FROM ${USERSTABLE} WHERE user_id = ?`, 
        [user_id]
    );
    return content.length > 0 ? content[0].password_hash : null;
};

// Update a user's password
export const updatePassword = async (user_id: number, new_password_hash: string): Promise<boolean> => {
    const [content] = await pool.query<ResultSetHeader>(
        `UPDATE ${USERSTABLE} SET password_hash = ? WHERE user_id = ?`,
        [new_password_hash, user_id]
    );
    return content.affectedRows > 0;
};

// Delete a user
export const deleteUser = async (user_id: User['user_id']): Promise<boolean> => {
    const [content] = await pool.query<ResultSetHeader>(
        `DELETE FROM ${USERSTABLE} WHERE user_id = ?`,
        [user_id]
    );
    return content.affectedRows > 0;
}