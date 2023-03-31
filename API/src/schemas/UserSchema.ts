import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../interfaces/User';

const userSchema: Schema = new Schema<User>({
  _id : { type: String},
  firstName : { type: String },
  lastName : { type: String },
  roles : {type : [String]},
  email : { type: String },
  photo : { type: String },
  publicNumber : {type : String},
  phoneNumber : {type : String}
});

export const UserSchema = mongoose.model<User>('User', userSchema);

