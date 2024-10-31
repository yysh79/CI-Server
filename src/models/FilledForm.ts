import mongoose, { Document, Schema } from 'mongoose';
// סכמה לשדות שמולאו
interface FilledField {
    label: string;
    value: any;  // הערך שמולא על ידי המשתמש
}
// סכמה לטופס שמולא
interface FilledFormDocument extends Document {
    formId: Schema.Types.ObjectId;    // מזהה של הטופס המקורי
    userId: Schema.Types.ObjectId;    // מזהה המשתמש שמילא את הטופס
    fields: FilledField[];            // רשימת השדות עם הערכים שמולאו
    filledAt: Date;                   // זמן המילוי של הטופס
}
// סכמה עבור הטופס שמולא
const filledFieldSchema: Schema = new Schema({
    label: { type: String, required: true },  // שם השדה
    value: { type: Schema.Types.Mixed, required: true }  // הערך שמולא בשדה
});

const filledFormSchema: Schema<FilledFormDocument> = new Schema({
    formId: { type: Schema.Types.ObjectId, ref: 'Form', required: true },  // קשר לטופס המקורי
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // קשר למשתמש שמילא
    fields: [filledFieldSchema],  // רשימת השדות עם הערכים שמולאו
    filledAt: { type: Date, default: Date.now }  // תאריך המילוי
});

// יצירת המודל
const FilledForm = mongoose.model<FilledFormDocument>('FilledForm', filledFormSchema);
export default FilledForm;
