
import { createServerResponse } from '../utils/responseUtils';
import { Request, Response } from 'express';
import User from '../models/userModel'
import { log } from 'console';
import ExcelJS from 'exceljs';

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
            { header: 'סיסמא', key: 'password', width: 30 },
        ];

        users.forEach(user => {
            worksheet.addRow({
                Fname: user.firstName, // הוספת שורה עבור כל משתמש
                Lname: user.lastName,
                phone: user.phone,
                email: user.email,
                password: user.password, 
                role: user.role,
            });
        });

        res.setHeader('Content-Disposition', 'attachment; filename="users.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');


        await workbook.xlsx.write(res);

        res.end();
    } catch (error) {
    console.error(error); // Log error
    res.status(500).json(createServerResponse(false, null,'Failed to export users to Excel', 'An error occurred while attempting to export users to Excel',error instanceof Error ? error.message : String(error)));
    }
}

export const searchUser = async (req: Request, res: Response): Promise<void> => {
    const search = req.params.searchName as string;

    if (search.length < 20) {
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
        console.log(users);
        
        res.status(201).json({
            isSuccessful: true,
            data: users,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id; // Get user ID from request parameters
        const deletedUser = await User.findByIdAndDelete(userId); // Delete user by ID

        if (!deletedUser) {
             res.status(404).json(createServerResponse( false,null,'User not found','The user with the provided ID does not exist in the database'));
        }

         res.status(200).json(createServerResponse( true, deletedUser, 'User deleted successfully', 'The user was successfully deleted from the database' )); 
    } catch (error) {
        console.error(error); // Log error
     res.status(500).json(createServerResponse( false,null, 'Internal Server Error', 'An error occurred while attempting to delete the user', error instanceof Error ? error.message : String(error)));
    }
}
