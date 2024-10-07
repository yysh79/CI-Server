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


  phone: { type: Number,    validate: { 
    validator: function(v: number) {return /^\d{10}$/.test(v.toString()); },
    message: (props: any) => `${props.value} is not a valid phone number! Phone number must be 10 digits.`
  },required: true ,unique: true},

  
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:  { type: String, required: true }

});

 const User = mongoose.model<IUser>('User', userSchema);
 export default User;
