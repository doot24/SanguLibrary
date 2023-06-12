import mongoose, { Schema, Document } from 'mongoose';
import { Hold } from '../interfaces/Hold';

const holdSchema: Schema = new Schema<Hold>({
  _id: { type: String },
  student: { type: String },
  resource: { type: Number },
  resource_id: { type: String },
  dateIssued: { type: Number }
});

export const HoldSchema = mongoose.model<Hold>('Hold', holdSchema);

