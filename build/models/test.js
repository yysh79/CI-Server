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
exports.addNewForm = exports.newFormData = void 0;
const formModel_1 = __importDefault(require("./formModel")); // שנה את הנתיב לפי המבנה שלך
require("dotenv/config");
// נתוני הטופס החדש
exports.newFormData = {
    title: "טופס הרשמה",
    description: "טופס לאיסוף פרטי משתמש",
    fields: [
        {
            label: "שם פרטי",
            type: "text",
            placeholder: "הכנס שם פרטי",
            required: true,
            value: ""
        },
        {
            label: "שם משפחה",
            type: "text",
            placeholder: "הכנס שם משפחה",
            required: true,
            value: ""
        },
        {
            label: "מסכים לתנאים",
            type: "checkbox",
            required: true,
            value: false
        },
        {
            label: "עיר",
            type: "text",
            placeholder: "הכנס עיר",
            required: true,
            value: ""
        }
    ],
    city: "שם העיר" // הוסף כאן את שם העיר
};
// פונקציה להוספת טופס חדש
const addNewForm = (formData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Adding new form:', formData); // לוג של הנתונים
    try {
        const form = new formModel_1.default(formData); // יצירת אובייקט חדש מהמודל
        yield form.save(); // שמירה בבסיס הנתונים
        console.log('Form added successfully:', form);
    }
    catch (error) {
        console.error('Error adding form:', error);
    }
});
exports.addNewForm = addNewForm;
