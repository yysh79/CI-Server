"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// הגדרת הסכמות
const fieldSchema = new mongoose_1.Schema({
    label: { type: String, required: true }, // תווית השדה
    type: { type: String, required: true }, // סוג השדה (למשל 'text', 'checkbox', 'button')
    placeholder: { type: String }, // טקסט placeholder (רלוונטי לתיבות טקסט)
    options: { type: [String], default: [] }, // רשימת אופציות עבור תיבות dropdown או צ'קבוקס
    required: { type: Boolean, default: false }, // האם השדה חובה
    value: { type: mongoose_1.Schema.Types.Mixed } // הערך של השדה (תלוי בסוג השדה)
});
const formSchema = new mongoose_1.Schema({
    title: { type: String, required: true }, // שם הטופס
    description: { type: String }, // תיאור הטופס
    city: { type: String, required: true }, // שדה עבור שם עיר
    fields: [fieldSchema], // רשימה של שדות (באמצעות ה-shema של שדות)
    createdAt: { type: Date, default: Date.now } // זמן יצירת הטופס
});
// יצירת המודל
const Form = mongoose_1.default.model('Form', formSchema);
exports.default = Form;
