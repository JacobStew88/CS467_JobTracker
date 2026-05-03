import { Request, Response } from 'express';
import { User, PublicUser, getUser, getUserById, updateUser, deleteUser } from '../models/userModel';
import { JWTUserPayload } from '../types/auth';
import { withErrorHandling } from './controllerWrapper';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export const getUserController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;

    const user: PublicUser | null = await getUser(userid);
    if (!user) {
        res.status(404).json({ error: "User not found"});
        return;
    }

    res.status(200).json(user);
})

export const updateUserController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;
    const { username, email } = req.body;
    if (!username && !email) {
        res.status(400).json({ error: "Must provide at least one field to update"});
        return;
    }
    if (username && !validator.isLength(username, { min: 3, max: 20 })) {
        res.status(400).json({ error: "Username must be between 3 and 20 characters"});
        return;
    }
    if (email && !validator.isEmail(email)) {
        res.status(400).json({ error: "Invalid email"});
        return;
    }
    const user: User | null = await getUserById(userid);
    if (!user) {
        res.status(404).json({ error: "User not found"});
        return;
    }
    const result = await updateUser({
        user_id: userid,
        username: username || user.username,
        email: email || user.email,
    } as PublicUser);
    if (!result) { res.status(500).json({ error: "Failed to update user"}); return; }
    res.status(200).json({message: "User updated successfully"});
})

// Delete a user FRONTEND SHOULD ASK FOR PASSWORD TO CONFIRM + Have a are you sure? Confirmation
export const deleteUserController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;

    const { password } = req.body;
    if (!password) { res.status(400).json({ error: "Password is required"}); return; }

    const user: User | null = await getUserById(userid);
    if (!user) { res.status(404).json({ error: "User not found"}); return; }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash); 
    if (!isPasswordValid) { res.status(401).json({ error: "Invalid password"}); return; }

    const result = await deleteUser(userid);
    if (!result) { res.status(500).json({ error: "Failed to delete user"}); return; }
    res.status(200).json({message: "User deleted successfully"});
}) 