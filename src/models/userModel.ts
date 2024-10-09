import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  phone:string ;
  email: string;
  password: string;
  role: string;
  code : string | null;
  expiresAt : Date | null ;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName :{ type: String, required: true },
  phone: {type: String,
    validate: {
      validator: function(v: string) {
        return /^\d{8,12}$/.test(v); },
      message: (props: any) => `${props.value} is not a valid phone number! Phone number must be between 8 and 12 digits.`},
    required: true,unique: true
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:  { type: String, required: true },
  code: { type: String, required: false },
  expiresAt: { type: Date, required: false }
});

 const User = mongoose.model<IUser>('User', userSchema);
 export default User;
