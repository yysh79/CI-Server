

import { Request, Response } from 'express';
import  User from '../models/userModel'
import { log } from 'console';
import * as XLSX from 'xlsx';

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        
        
        res.status(200).json(users);
    } catch (error) {
       
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
        const excelSheet = XLSX.utils.json_to_sheet(users);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, excelSheet, 'Users');


         const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Disposition', 'attachment; filename="users.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // שליחת הקובץ ללקוח
        res.send(excelBuffer);
    } catch (error) {
       
        res.status(500).json({ message: 'Failed to export users to Excel', error });
    }
}
  
  