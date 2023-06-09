import mongoose, { Schema } from 'mongoose';

import { Book } from '../../interfaces/Resources/Book';

import { resourceMetaSchema } from '../ResourceSchema';

const bookSchema: Schema = new Schema<Book>({
  _id: { type: String },
  title: { type: String, index: true },
  resourceType: { type: Number },
  subTitle: { type: String },
  authors: { type: [String], index: true },
  editors: { type: [String] },
  description: { type: String },
  category: { type: String },
  isbn: { type: String },
  publication: { type: String },
  publicationLocation: { type: String },
  publicationYear: { type: String },
  resume: { type: String },
  remark: { type: String },
  saveCipher: { type: String },
  resourceMeta: { type: resourceMetaSchema }
});
bookSchema.index({ title: "text", authors: "text", editors : "text", isbn : "text", saveCipher : "text" });

export const BookSchema = mongoose.model<Book>('Book', bookSchema);
