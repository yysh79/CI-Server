"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.searchUser = exports.exportToExcelAllUsers = exports.addUsers = exports.getAllUsers = void 0;
const responseUtils_1 = require("../utils/responseUtils");
const userModel_1 = __importDefault(require("../models/userModel"));
const console_1 = require("console");
const exceljs_1 = __importDefault(require("exceljs"));
const getAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        (0, console_1.log)(users);
        res.status(200).json(users);
    }
    catch (error) {
        (0, console_1.log)(error);
        res.status(500).json({ message: 'Failed to fetch users', error: error });
    }
});
exports.getAllUsers = getAllUsers;
const addUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // קח את המידע מהבקשה
        const userData = req.body;
        // צור משתמש חדש
        const newUser = new userModel_1.default(userData);
        const savedUser = yield newUser.save();
        (0, console_1.log)(savedUser);
        res.status(201).json((0, responseUtils_1.createServerResponse)(true, savedUser, 'User added successfully'));
    }
    catch (error) {
        (0, console_1.log)(error);
        // בדוק אם השגיאה היא אובייקט מסוג Error
        if (error instanceof Error) {
            // שלח תגובה עם שגיאה
            res.status(500).json((0, responseUtils_1.createServerResponse)(false, null, 'Failed to add user', null, error.message));
        }
        else {
            // במידה והשגיאה אינה מסוג Error
            res.status(500).json((0, responseUtils_1.createServerResponse)(false, null, 'Failed to add user', null, 'An unknown error occurred'));
        }
    }
});
exports.addUsers = addUsers;
const exportToExcelAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find().lean();
        const workbook = new exceljs_1.default.Workbook();
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
        yield workbook.xlsx.write(res);
        res.end();
    }
    catch (error) {
        console.error(error); // Log error
        res.status(500).json((0, responseUtils_1.createServerResponse)(false, null, 'Failed to export users to Excel', 'An error occurred while attempting to export users to Excel', error instanceof Error ? error.message : String(error)));
    }
});
exports.exportToExcelAllUsers = exportToExcelAllUsers;
const searchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.params.searchName;
    if (!search) {
        res.status(400).json({ message: 'Search query is required' });
    }
    try {
        const users = yield userModel_1.default.find({
            $or: [
                { firstName: new RegExp(search, 'i') },
                { lastName: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
            ]
        });
        res.status(200).json({
            isSuccessful: true,
            data: users,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.searchUser = searchUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id; // Get user ID from request parameters
        const deletedUser = yield userModel_1.default.findByIdAndDelete(userId); // Delete user by ID
        if (!deletedUser) {
            res.status(404).json((0, responseUtils_1.createServerResponse)(false, null, 'User not found', 'The user with the provided ID does not exist in the database'));
        }
        else {
            res.status(200).json((0, responseUtils_1.createServerResponse)(true, deletedUser, 'User deleted successfully', 'The user was successfully deleted from the database'));
        }
    }
    catch (error) {
        console.error(error); // Log error
        res.status(500).json((0, responseUtils_1.createServerResponse)(false, null, 'Internal Server Error', 'An error occurred while attempting to delete the user', error instanceof Error ? error.message : String(error)));
    }
});
exports.deleteUser = deleteUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id; // קבלת ה-ID מהפרמטרים של הבקשה
    const updatedData = req.body; // קבלת הנתונים המעודכנים מהבקשה
    try {
        // חפש את המשתמש לפי ה-ID
        const user = yield userModel_1.default.findById(userId);
        // בדוק אם המשתמש קיים
        if (!user) {
            res.status(404).json((0, responseUtils_1.createServerResponse)(false, null, 'User not found'));
        }
        else {
            const { email } = updatedData, otherUpdates = __rest(updatedData, ["email"]);
            Object.assign(user, otherUpdates);
            const updatedUser = yield user.save();
            res.status(200).json((0, responseUtils_1.createServerResponse)(true, updatedUser, 'User updated successfully'));
        }
    }
    catch (error) {
        (0, console_1.log)(error);
        if (error instanceof Error) {
            res.status(500).json((0, responseUtils_1.createServerResponse)(false, null, 'Failed to update user', null, error.message));
        }
        else {
            res.status(500).json((0, responseUtils_1.createServerResponse)(false, null, 'Failed to update user', null, 'An unknown error occurred'));
        }
    }
});
exports.updateUser = updateUser;
