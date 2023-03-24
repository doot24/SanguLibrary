import mongoose, { Schema, Document } from 'mongoose';

const categorySchema: Schema = new Schema({
  index : { type: String},
  text : { type: String }
});

export const CategorySchema = mongoose.model('Category', categorySchema);

