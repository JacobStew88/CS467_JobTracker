import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {
    User,
    PublicUser,
    getUserByEmail,
    getUserByUsername,
    createUser,
    updatePassword
} from '../models/userModel';
import {
    createPasswordResetToken,
    getPasswordResetToken,
    markPasswordResetTokenUsed
} from '../models/passwordResetModel';
import { JWTUserPayload } from '../types/auth';
import { withErrorHandling } from './controllerWrapper';
import validator from 'validator';

const JWT_SECRET = process.env.JWT_SECRET || 'DEVELOPMENT_FALL_BACK_KEY';

const ERROR_INVALID_CRED = {error: "Invalid Creditional"}

export const userLogin = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: "Missing username or password" });
        return;
    }

    // getUserby Email from DB
    const user: User | null  = await getUserByUsername(username);
    if (!user) { res.status(401).json(ERROR_INVALID_CRED); return} // User not found

    // If found compare the password via bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) { res.status(401).json(ERROR_INVALID_CRED); return}

    // Create and the give the tocken back to the user
    const token = jwt.sign({ user_id: user.user_id } as JWTUserPayload, JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ token });
});

export const userCreateAccount = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        res.status(400).json({ error: "Missing email, username or password" });
        return;
    }

    // getUserbyEmail
    const existingUserEmail: User | null = await getUserByEmail(email);
    if (existingUserEmail) { res.status(401).json(ERROR_INVALID_CRED); return} // User exist alr

    // getUserbyUsername
    const existingUsername: User | null = await getUserByUsername(username);
    if (existingUsername) { res.status(401).json(ERROR_INVALID_CRED); return} // User exist alr

    if (!validator.isEmail(email)) {
        res.status(400).json({ error: "Invalid email" });
        return;
    }
    if (!validator.isLength(username, { min: 3, max: 20 })) {
        res.status(400).json({ error: "Username must be between 3 and 20 characters" });
        return;
    }
    if (!validator.isStrongPassword(password)) {
        res.status(400).json({ error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character" });
        return;
    }



    // Salt and hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user and store in the DB
    const newUserId: PublicUser['user_id'] = await createUser({
        username: username,
        email: email,
        password_hash: hashedPassword
    });

    // Create and the give the tocken back to the user
    const token = jwt.sign({ user_id: newUserId } as JWTUserPayload, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token });
});

export const userForgotPassword = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: "Missing email" });
        return;
    }

    const genericMessage = {
        message: "If an account exists, a password reset link has been generated."
    };

    const user: User | null = await getUserByEmail(email);

    if (!user) {
        res.status(200).json(genericMessage);
        return;
    }

    const rawToken = crypto.randomBytes(32).toString('hex');

    const tokenHash = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest('hex');

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await createPasswordResetToken(user.user_id, tokenHash, expiresAt);

    console.log(`Password reset link: http://localhost:5173/reset-password?token=${rawToken}`);

    res.status(200).json(genericMessage);
});

export const userResetPassword = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        res.status(400).json({ error: "Missing token or new password" });
        return;
    }

    if (!validator.isStrongPassword(newPassword)) {
        res.status(400).json({ error: "Password must meet complexity requirements" });
        return;
    }

    const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const resetRecord = await getPasswordResetToken(tokenHash);

    if (!resetRecord) {
        res.status(400).json({ error: "Invalid or expired reset token" });
        return;
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await updatePassword(resetRecord.user_id, hashedPassword);
    await markPasswordResetTokenUsed(resetRecord.token_id);

    res.status(200).json({ message: "Password successfully reset" });
});

// NOTE: LOGIN IS HANDLED BY THE FRONTEND, SO NO LOGOUT FUNCTION IS NEEDED