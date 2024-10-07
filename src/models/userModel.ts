import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  phone:number ;
  email: string;
  password: string;
  role: string;
}



const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName :{ type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:  { type: String, required: true }
});

 const User = mongoose.model<IUser>('User', userSchema);
 export default User;
