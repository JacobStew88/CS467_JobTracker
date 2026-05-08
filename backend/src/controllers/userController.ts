import { Request, Response } from 'express';
import { User, PublicUser, getUser, getUserById, updateUser, deleteUser } from '../models/userModel.js';
import { JWTUserPayload } from '../types/auth.js';
import { withErrorHandling } from './controllerWrapper.js';
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

    const updateData: Partial<PublicUser> = {};
    if (username !== undefined) {
        if (typeof username !== 'string') {
            res.status(400).json({ error: "Invalid username format" });
            return;
        }
        const trimmedUsername = username.trim();
        if (!validator.isLength(trimmedUsername, { min: 3, max: 20 })) {
            res.status(400).json({ error: "Username must be between 3 and 20 characters" });
            return;
        }
        updateData.username = trimmedUsername;
    }

    if (email !== undefined) {
        if (typeof email !== 'string') { res.status(400).json({ error: "Invalid email format" }); return; }
        const trimmedEmail = email.trim().toLowerCase();
        if (!validator.isEmail(trimmedEmail)) { res.status(400).json({ error: "Invalid email" }); return; }
        updateData.email = trimmedEmail;
    }

    if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: "Must provide at least one valid field to update" });
        return;
    }

    const user: User | null = await getUserById(userid);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const result = await updateUser({
        ...user,
        ...updateData,
    });

    if (!result) { res.status(500).json({ error: "Failed to update user" }); return; }

    res.status(200).json({ message: "User updated successfully" });
});

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