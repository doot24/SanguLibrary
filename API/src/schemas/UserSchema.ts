import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interfaces/User';

const userSchema: Schema = new Schema<IUser>({
  userid : { type: String},
  firstName : { type: String },
  lastName : { type: String },
  roles : {type : [String]},
  email : { type: String },
  photo : { type: String },
  publicNumber : {type : String},
  phoneNumber : {type : String}
});

export const UserSchema = mongoose.model<IUser>('User', userSchema);

