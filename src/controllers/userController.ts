
import { createServerResponse } from '../utils/responseUtils';
import { Request, Response } from 'express';
import User from '../models/userModel'
import Form from '../models/formModel';
import { log } from 'console';
import ExcelJS, { Cell } from 'exceljs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt'
import { MongoClient } from 'mongodb';
import { connectDatabase } from '../config/mongoDbConect';
import FilledForm from '../models/FilledForm';

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        log(users);      
        res.status(200).json(createServerResponse(true, users, " match users"));
    } catch (error) {
        log(error);
        res.status(500).json({ message: 'Failed to fetch users', error: error });
    }
};
export const getAllForms = async (_req: Request, res: Response) => {
    try {
        const allFroms = await Form.find();
        log(allFroms)
        res.status(200).json({ isSuccessful: true, data: allFroms, });
    } catch (error: any) {
        log(error);
        res.status(500).json({ isSuccessful: false, message: 'Failed to fetch forms', error: error.message });
    }
}


export const myLogInWithGoogle = async (req: Request, res: Response) => {
    try {
        const checkuser = await User.findOne({email: req.body.email});
        
        if (!checkuser) {
        console.log(checkuser + " was not found");
        res.status(404).json(createServerResponse(false,  ' email not found'));
        return;    
        }
        res.status(200).json(createServerResponse(true, checkuser, ' email found'));
        console.log(checkuser + " email found");

    } catch (error: unknown) {
       
       console.log("try did not work");
       
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
    try { const users = await User.find().lean();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Users');
        worksheet.views = [{ rightToLeft: true }];
        const headerStyle = {font: { bold: true, size: 12, }, alignment: { horizontal: 'center' as const, vertical: 'middle' as const, }};
        worksheet.columns = [
            { header: 'שם פרטי', key: 'Fname', width: 20, style: headerStyle },
            { header: 'שם משפחה', key: 'Lname', width: 20, style: headerStyle },
            { header: 'מספר טלפון', key: 'phone', width: 25, style: headerStyle },
            { header: 'מייל', key: 'email', width: 30, style: headerStyle },
            { header: 'תפקיד', key: 'role', width: 15, style: headerStyle },
            { header: 'סיסמא', key: 'password', width: 80, style: headerStyle },];
        users.forEach(user => {const row = worksheet.addRow({
                Fname: user.firstName, Lname: user.lastName, phone: user.phone,
                email: user.email, password: user.password, role: user.role,});
            row.eachCell((cell: Cell) => {
                cell.style.alignment = { horizontal: 'center' as const, vertical: 'middle' as const, };
                cell.style.font = { bold: false, };});});
        res.setHeader('Content-Disposition', 'attachment; filename="users.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {console.error(error);
        res.status(500).json(createServerResponse(false, null, 'היצוא לאקסל נכשל!', 'שגיאה הופיעה',
      error instanceof Error ? error.message : String(error)));}};


export const searchUser = async (req: Request, res: Response): Promise<void> => {
    const search = req.params.searchName as string;


    if (!search) {
        res.status(400).json({ message: 'Search query is required' });
        return;
    }

    try {
        const users = await User.find({
            $or: [
                { firstName: new RegExp(`^${search}`, 'i') },
                { lastName: new RegExp(`^${search}`, 'i') },
                { email: new RegExp(`^${search}`, 'i') },
            ]
        });
        res.status(200).json({
            isSuccessful: true,
            data: users,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id; 
        const deletedUser = await User.findByIdAndDelete(userId); 
        if (!deletedUser) {
            res.status(404).json(createServerResponse(false, null, 'הid של המשתמש לא נמצא!'));
        }
        else {
            res.status(200).json(createServerResponse(true, deletedUser, 'המשתמש נמחק בהצלחה !'));
        }
    } catch (error) {
        console.error(error); 
        res.status(500).json(createServerResponse(false, null, 'שגיאה הופיעה!',
         error instanceof Error ? error.message : String(error)));
    }
};

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
        else {
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
export const updateForm = async (req: Request, res: Response) => {
    console.log("Entering updateForm function");
    const formId = req.params.id; // מזהה הטופס
    const itemId = req.body.itemId; // מזהה השדה לעדכון
    const updatedData = req.body.updatedFieldData; // הנתונים החדשים לעדכון
    if (!updatedData || Object.keys(updatedData).length === 0) {
        res.status(400).json(createServerResponse(false, null, 'No data provided for update'));
        return;
    }

    try {
        const form = await Form.findById(formId);
        console.log("Form before update:", form);

        if (!form) {
            res.status(404).json(createServerResponse(false, null, 'Form not found'));
            return;
        }

        // מציאת השדה בתוך ה-fields לפי ה-ID שלו
        const item = form.fields.find((field: any) => field._id.toString() === itemId);

        if (!item) {
            res.status(404).json(createServerResponse(false, null, 'Field not found in the form'));
            return;
        }

        // עדכון השדות הרלוונטיים באובייקט שנמצא
        Object.assign(item, updatedData);

        // שמירת השינויים
        const updatedForm = await form.save();
        res.status(200).json(createServerResponse(true, updatedForm, 'Field updated successfully'));
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json(createServerResponse(false, null, 'Failed to update form', null, error.message));
        } else {
            res.status(500).json(createServerResponse(false, null, 'Failed to update form', null, 'An unknown error occurred'));
        }
    }
};


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // יוצר מספר בין 100000 ל-999999
};

export const createOTP = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404).json(createServerResponse(false, null, 'User not found.', 'The user with the provided email does not exist.'));
        return;
    }

    const otp = generateOTP();
    user.code = otp;
    user.expiresAt = new Date(Date.now() + 3600000); // תוקף אחרי שעה
    await user.save();

    // הגדרת ה-transporter עם פרטי האימות
    const transporter = nodemailer.createTransport({
        service: 'gmail', // או כל שירות דוא"ל אחר
        auth: {
            user: 'oral.yosf.h@gmail.com', // הכנס את המייל שלך
            pass: 'liht aqzf whzb ipmm',  // הכנס את הסיסמה שלך או השתמש בסיסמה לאפליקציות אם נדרש
        },
    });

    const mailOptions = {
        from: 'oral.yosf.h@gmail.com', // הכנס את המייל שלך
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json(createServerResponse(true, null, 'OTP sent successfully!', 'The OTP has been sent to the provided email address.'));
        return;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error sending email:', error);
            res.status(500).json(createServerResponse(false, null, 'Error sending email', 'Failed to send the OTP email.', error.message));
            return;
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json(createServerResponse(false, null, 'Unexpected error occurred', 'An unexpected error occurred.'));
            return;
        }
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404).json(createServerResponse(false, null, 'User not found.', 'The user with the provided email does not exist.'));
        return;
    }

    if (user.code !== otp) {
        res.status(400).json(createServerResponse(false, null, 'Invalid OTP.', 'The OTP provided does not match.'));
        return;
    }

    const now = new Date();
    if (user.expiresAt && now > user.expiresAt) {
        res.status(400).json(createServerResponse(false, null, 'OTP has expired.', 'The provided OTP has exceeded its validity period.'));
        return;
    }

    // אם הכל בסדר, ניתן לאשר את המשתמש
    user.code = null;
    user.expiresAt = null;
    await user.save();

    res.status(200).json(createServerResponse(true, null, 'OTP verified successfully!', 'The OTP has been successfully verified.'));
};

interface User {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    role: string;
    comparePassword: (password: string) => Promise<boolean>;
};

export const generateJWTToken = (user: User): string => {
    const payload = { firstName: user.firstName, lastName: user.lastName, phone: user.phone, email: user.email, role: user.role, };
    const secret = process.env.JWT_SECRET;
    if (!secret) { throw new Error('JWT_SECRET is not defined'); }
    return jwt.sign(payload, secret, { expiresIn: '1h' });
}
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json(createServerResponse(false, null, 'הכנס מייל וסיסמא !')); return;
    } try {
        const user = await User.findOne({ email }).exec();
        if (!user) { res.status(404).json(createServerResponse(false, null, 'משתמש לא נמצא !')); return; }
        const hashedPasswordFromDB = user.password;
        const bcryptResult = await bcrypt.compare(password, hashedPasswordFromDB);
        if (!bcryptResult) { res.status(401).json(createServerResponse(false, null, 'סיסמא לא תואמת !')); return; }
        const token = generateJWTToken(user);
        res.status(200).json(createServerResponse(true, { user, token }, ' התחברות בהצלחה !'));
    } catch (error) {
        console.error(error); 
        res.status(500).json(createServerResponse(false, null, 'Internal server error', null, error instanceof Error ? error.message : String(error)));
    }
     
};



export const addFilledForm = async (req: Request, res: Response): Promise<void> => {
    try {
        // קח את המידע מהבקשה
        const filledFormData = req.body;
        // צור טופס שמולא חדש
        const newFilledForm = new FilledForm(filledFormData);
        // שמור את הטופס במונגו
        const savedFilledForm = await newFilledForm.save();
        log(savedFilledForm);
        res.status(201).json(createServerResponse(true, savedFilledForm, 'Filled form added successfully'));
    } catch (error: unknown) { 
        log(error);
        // בדוק אם השגיאה היא אובייקט מסוג Error
        if (error instanceof Error) {
            // שלח תגובה עם שגיאה
            res.status(500).json(createServerResponse(false, null, 'Failed to add filled form', null, error.message));
        } else {
            // במידה והשגיאה אינה מסוג Error
            res.status(500).json(createServerResponse(false, null, 'Failed to add filled form', null, 'An unknown error occurred'));
        }
    }
};
