import { pool } from '../config/db.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface PasswordResetToken extends RowDataPacket {
    token_id: number;
    user_id: number;
    token_hash: string;
    expires_at: Date;
}

const RESETTABLE = 'PasswordResetTokens';

// create token record
export const createPasswordResetToken = async (
    user_id: number,
    token_hash: string,
    expires_at: Date
): Promise<number> => {
    const [content] = await pool.query<ResultSetHeader>(
        `INSERT INTO ${RESETTABLE} (user_id, token_hash, expires_at) VALUES (?, ?, ?)`,
        [user_id, token_hash, expires_at]
    );

    return content.insertId;
};

// get valid token
export const getPasswordResetToken = async (token_hash: string): Promise<PasswordResetToken | null> => {
    const [content] = await pool.query<PasswordResetToken[]>(
        `SELECT * FROM ${RESETTABLE}
         WHERE token_hash = ?
         AND used_at IS NULL
         AND expires_at > NOW()`,
        [token_hash]
    );

    return content.length > 0 ? content[0] : null;
};

// mark token used after successful password reset
export const markPasswordResetTokenUsed = async (token_id: number): Promise<boolean> => {
    const [content] = await pool.query<ResultSetHeader>(
        `UPDATE ${RESETTABLE}
         SET used_at = NOW()
         WHERE token_id = ?`,
        [token_id]
    );

    return content.affectedRows > 0;

};

// optional cleanup expired tokens
export const deleteExpiredTokens = async (): Promise<void> => {
    await pool.query(
        `DELETE FROM ${RESETTABLE} WHERE expires_at < NOW()`
    );
};