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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUsers = exports.getAllUsers = void 0;
const responseUtils_1 = require("../utils/responseUtils");
const userModel_1 = __importDefault(require("../models/userModel"));
const console_1 = require("console");
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
