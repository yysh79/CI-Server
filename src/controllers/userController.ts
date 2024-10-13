
import { createServerResponse } from '../utils/responseUtils';
import { Request, Response } from 'express';
import User from '../models/userModel'
import { log } from 'console';
import ExcelJS from 'exceljs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        log(users);      
        res.status(200).json({
            isSuccessful: true,
            data: users,
        });
    } catch (error) {
        log(error);      
        res.status(500).json({ message: 'Failed to fetch users', error:error });
    }
};

export const addUsers = async (req: Request, res: Response): Promise<void> => {
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
        else{
        res.status(200).json(createServerResponse( true, deletedUser, 'User deleted successfully', 'The user was successfully deleted from the database' )); 
        }
    } catch (error) {
        console.error(error); // Log error
     res.status(500).json(createServerResponse( false,null, 'Internal Server Error', 'An error occurred while attempting to delete the user', error instanceof Error ? error.message : String(error)));
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
    const saltRounds = 10;
    user.code = await bcrypt.hash(otp, saltRounds);   // שליחת קוד מוצפן
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
    if (!user.code) {
        res.status(400).json(createServerResponse(false, null, 'Invalid OTP.', 'No OTP found for this user.'));
        return;
    }
    const isMatch = await bcrypt.compare(otp, user.code); // השוואת ה-OTP המוזן עם הקוד המוצפן
    if (!isMatch) {
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
}

export const generateJWTToken = (user: User): string => {
    const payload = {
        firstName:user.firstName,
        lastName:user.lastName,
        phone:user.phone,
        email:user.email,
        role:user.role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body; 

    if (!email || !password) {
     res.status(400).json(createServerResponse(false, null, 'הכנס מייל וסיסמא !'));
     return;
    }

    try {
        const user = await User.findOne({ email }).exec(); 
        console.log("Retrieved User Object:", user); 

        if (!user) { 
             res.status(404).json(createServerResponse(false, null, 'משתמש לא נמצא !'));
             return;
        }

        
        const hashedPasswordFromDB = user.password;
        const bcryptResult = await bcrypt.compare(password, hashedPasswordFromDB);
        console.log("Bcrypt comparison result:", bcryptResult); // Log the result of bcrypt comparison

        if (!bcryptResult) { 
             res.status(401).json(createServerResponse(false, null, 'סיסמא לא תואמת !'));
             return;
        }

       
        const token = generateJWTToken(user); 

        res.status(200).json(createServerResponse(true, { user, token }, ' התחברות בהצלחה !'));
    } catch (error) {
        console.error(error); 
        res.status(500).json(createServerResponse(false, null, 'Internal server error', null, error instanceof Error ? error.message : String(error)));
    }
};
export const logout = (req: Request, res: Response) => {
    res.status(200).json(createServerResponse(true, null, 'התנתקת בהצלחה!'));
};
