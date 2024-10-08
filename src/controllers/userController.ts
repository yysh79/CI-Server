
import { createServerResponse } from '../utils/responseUtils';
import { Request, Response } from 'express';
import  User from '../models/userModel'
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
        res.status(500).json({ message: 'Failed to export users to Excel', error });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id; // קבלת ה-ID מהפרמטרים של הבקשה
    const updatedData = req.body; // קבלת הנתונים המעודכנים מהבקשה
    try {
        // חפש את המשתמש לפי ה-ID
        const user = await User.findById(userId);        
        // בדוק אם המשתמש קיים
        if (!user) {
            res.status(404).json(createServerResponse(false, null, 'User not found'));
        }
        else{           
        const { email, ...otherUpdates } = updatedData; 
        Object.assign(user, otherUpdates); 
        const updatedUser = await user.save();
        res.status(200).json(createServerResponse(true, updatedUser, 'User updated successfully'));
        }
    } 
    catch (error: unknown) { 
        log(error);
        if (error instanceof Error) {
            res.status(500).json(createServerResponse(false, null, 'Failed to update user', null, error.message));
        } else {
            res.status(500).json(createServerResponse(false, null, 'Failed to update user', null, 'An unknown error occurred'));
        }
    }    
};

  
  