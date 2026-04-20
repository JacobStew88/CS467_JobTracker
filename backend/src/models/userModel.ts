import { pool } from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// User interface
export interface User extends RowDataPacket {
    user_id: number;
    username: string;
    email: string;
    password_hash: string;
}
export type PublicUser = Omit<User, 'password_hash'>;

const USERSTABLE: string = 'Users';

/*
@result: ResultSetHeader {
    fieldCount: 0,
    affectedRows: 0,
    insertId: 0,
    info: '',
    serverStatus: 2,
    warningStatus: 0,
    changedRows: 0
}
Source: https://sidorares.github.io/node-mysql2/docs/documentation/typescript-examples
*/

/* -- CRUD QUERIES FOR USERS: -- */
// Create a new user
export const createUser = async (user: User): Promise<PublicUser> => {
    const [content] = await pool.query<ResultSetHeader>(
        `INSERT INTO ${USERSTABLE} (username, email, password_hash) VALUES (?, ?, ?)`,
        [user.username, user.email, user.password_hash]
    );

    return {
        user_id: content.insertId,
        username: user.username,
        email: user.email
    };
};

// Get a user
export const getUser = async (user_id: User['user_id']): Promise<PublicUser | null> => {
    const [content] = await pool.query<User[]>(
        `SELECT user_id, username, email FROM ${USERSTABLE} WHERE user_id = ?`, 
        [user_id]
    );
    return content.length > 0 ? content[0] as PublicUser : null;
}   

// Update a user
export const updateUser = async(user: User): Promise<boolean> => {
    const [content] = await pool.query<ResultSetHeader>(
        `Update ${USERSTABLE} SET username = ?, email = ? WHERE user_id = ?`,
        [user.username, user.email, user.user_id]
    );
    return content.affectedRows > 0;
}

// Get user's hashed password -- NOTE: FOR BACKEND VERFICIATION ONLY --
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
export const deleteUser = async(user_id: User['user_id']): Promise<boolean> => {
    const [content] = await pool.query<ResultSetHeader>(
        `DELETE FROM ${USERSTABLE} WHERE user_id = ?`,
        [user_id]
    );
    return content.affectedRows > 0;
}