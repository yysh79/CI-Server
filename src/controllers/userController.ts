
import { createServerResponse } from '../utils/responseUtils';
import { Request, Response } from 'express';
import User from '../models/userModel'
import { log } from 'console';

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        log(users);      
        res.status(200).json(users);
    } catch (error) {
        log(error);      
        res.status(500).json({ message: 'Failed to fetch users', error:error });
    }
};

export const addUsers = async (req: Request, res: Response) => {
    try {
        // קח את המידע מהבקשה
        const userData = req.body;
        // צור משתמש חדש
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        log(savedUser);
        res.status(201).json(createServerResponse(true, savedUser, 'User added successfully'));

    } catch (error: unknown) { 
        log(error);
        // בדוק אם השגיאה היא אובייקט מסוג Error
        if (error instanceof Error) {
            // שלח תגובה עם שגיאה
            res.status(500).json(createServerResponse(false, null, 'Failed to add user', null, error.message));
        } else {
            // במידה והשגיאה אינה מסוג Error
            res.status(500).json(createServerResponse(false, null, 'Failed to add user', null, 'An unknown error occurred'));
        }
    }
};
  
  