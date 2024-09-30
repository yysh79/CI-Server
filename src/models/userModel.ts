import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  lastName: string;
  phon:number ;
  email: string;
  password: string;
  role: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  lastName :{ type: String, required: true },
  phon: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:  { type: String, required: true }

});

 const User = mongoose.model<IUser>('User', userSchema);
 export default User;
