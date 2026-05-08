import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { 
    User, 
    PublicUser, 
    getUserByEmail, 
    getUserByUsername, 
    createUser, 
} from '../models/userModel.js';
import { JWTUserPayload } from '../types/auth.js';
import { withErrorHandling } from './controllerWrapper.js';
import validator from 'validator';

const JWT_SECRET = process.env.JWT_SECRET || 'DEVELOPMENT_FALL_BACK_KEY';

const ERROR_INVALID_CRED = {error: "Invalid Creditional"}

export const userLogin = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: "Missing username or password" });
        return;
    }

    // Clean the white spaces from the username and password
    const cleanedusername = username.trim();
    const cleanedPassword = password.trim();

    // getUserby Email from DB
    const user: User | null  = await getUserByUsername(cleanedusername);  
    if (!user) { res.status(401).json(ERROR_INVALID_CRED); return} // User not found

    console.log("Found User:", user);
    
    // If found compare the password via bcrypt
    const isPasswordValid = await bcrypt.compare(cleanedPassword, user.password_hash);
    console.log("Is Password Valid?", isPasswordValid);
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

    const cleanedEmail = email.trim();
    const cleanedUsername = username.trim();
    const cleanedPassword = password.trim();

    // getUserbyEmail
    const existingUserEmail: User | null = await getUserByEmail(cleanedEmail); 
    if (existingUserEmail) { res.status(401).json(ERROR_INVALID_CRED); return} // User exist alr

    // getUserbyUsername
    const existingUsername: User | null = await getUserByUsername(cleanedUsername); 
    if (existingUsername) { res.status(401).json(ERROR_INVALID_CRED); return} // User exist alr

    if (!validator.isEmail(cleanedEmail)) {
        res.status(400).json({ error: "Invalid email" });
        return;
    }
    if (!validator.isLength(cleanedUsername, { min: 3, max: 20 })) {
        res.status(400).json({ error: "Username must be between 3 and 20 characters" });
        return;
    }
    if (!validator.isStrongPassword(cleanedPassword)) {
        res.status(400).json({ error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character" });
        return;
    }

    // Salt and hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(cleanedPassword, salt);

    // Create the new user and store in the DB
    const newUserId: PublicUser['user_id'] = await createUser({ 
        username: cleanedUsername,
        email: cleanedEmail,
        password_hash: hashedPassword
    }); 

    // Create and the give the tocken back to the user
    const token = jwt.sign({ user_id: newUserId } as JWTUserPayload, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token });
});

// NOTE: LOGIN IS HANDLED BY THE FRONTEND, SO NO LOGOUT FUNCTION IS NEEDED