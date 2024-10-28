import mongoose, { Document, Schema } from 'mongoose';

// הגדרת הסכמה לשדות
interface Field {
    label: string;
    type: string;
    placeholder?: string;
    options?: string[];
    required?: boolean;
    value?: any;
}

// הגדרת הסכמה לטופס
interface FormDocument extends Document {
    title: string;
    description?: string;
    city?: string;                       // שדה  עבור שם העיר
    fields: Field[];
    createdAt: Date;
}

// הגדרת הסכמות
const fieldSchema: Schema = new Schema({
    label: { type: String, required: true }, // תווית השדה
    type: { type: String, required: true }, // סוג השדה (למשל 'text', 'checkbox', 'button')
    placeholder: { type: String },             // טקסט placeholder (רלוונטי לתיבות טקסט)
    options: { type: [String], default: [] },  // רשימת אופציות עבור תיבות dropdown או צ'קבוקס
    required: { type: Boolean, default: false },  // האם השדה חובה
    value: { type: Schema.Types.Mixed }      // הערך של השדה (תלוי בסוג השדה)
});

const formSchema: Schema<FormDocument> = new Schema({
    title: { type: String, required: true },    // שם הטופס
    description: { type: String },                 // תיאור הטופס
    city: { type: String, required: true },       // שדה עבור שם עיר
    fields: [fieldSchema],                       // רשימה של שדות (באמצעות ה-shema של שדות)
    createdAt: { type: Date, default: Date.now }   // זמן יצירת הטופס
});

// יצירת המודל
const Form = mongoose.model<FormDocument>('Form', formSchema);
export default Form;
