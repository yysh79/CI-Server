import mongoose, { Schema, Document,Model } from 'mongoose';
import bcrypt from 'bcrypt';
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  idNumber: string;
  phone: string;
  email: string;
  city: string;
  password: string;
  role: string;
  code: string | null;
  expiresAt: Date | null;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^\d{8,12}$/.test(v);
      },
      message: (props: any) => `${props.value} is not a valid phone number! Phone number must be between 8 and 12 digits.`
    },
    required: true, unique: true
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  code: { type: String, required: false },
  expiresAt: { type: Date, required: false }
});

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10); 
  this.password = await bcrypt.hash(this.password, salt); 
  next(); 
});


userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password); 
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema); // Create the User model
export default User; 