

import { Request, Response } from 'express';
import User from '../models/userModel'
import { log } from 'console';
import ExcelJS from 'exceljs';

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();


        res.status(200).json(users);
    } catch (error) {

        res.status(500).json({ message: 'Failed to fetch users', error: error });
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

        res.status(201).json({
            isSuccessful: true,
            displayMessage: 'User added successfully',
            description: null,
            exception: null,
            data: savedUser,
        });
    } catch (error: unknown) {
        log(error);

        // בדוק אם השגיאה היא אובייקט מסוג Error
        if (error instanceof Error) {
            // שלח תגובה עם שגיאה
            res.status(500).json({
                isSuccessful: false,
                displayMessage: 'Failed to add user',
                description: null,
                exception: error.message, // השתמש במסר מהשגיאה
                data: null,
            });
        } else {
            // במידה והשגיאה אינה מסוג Error
            res.status(500).json({
                isSuccessful: false,
                displayMessage: 'Failed to add user',
                description: null,
                exception: 'An unknown error occurred', // הודעה כללית
                data: null,
            });
        }
    }
};

export const exportToExcelAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().lean();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Users');


        worksheet.columns = [
            { header: 'שם פרטי', key: 'Fname', width: 30 },
            { header: 'שם משפחה', key: 'Lname', width: 30 },
            { header: 'מספר טלפון', key: 'phone', width: 30 },
            { header: 'מייל', key: 'email', width: 30 },
            { header: 'תפקיד', key: 'role', width: 30 },
        ];

        users.forEach(user => {
            worksheet.addRow(user); // הוספת שורה עבור כל משתמש
        });

        res.setHeader('Content-Disposition', 'attachment; filename="users.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');


        await workbook.xlsx.write(res);

        res.end();
    } catch (error) {

        res.status(500).json({ message: 'Failed to export users to Excel', error });
    }
}

export const searchUser = async (req: Request, res: Response): Promise<void> => {
    const search = req.params.searchName as string;

    if (!search) {
        res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const users = await User.find({
            $or: [
                { name: new RegExp(search, 'i') },
                { lastName: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
            ]
        });
        
        res.status(201).json({
            isSuccessful: true,
            data: users,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

