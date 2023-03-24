import mongoose, { Schema } from 'mongoose';

import { DigitalBook } from '../interfaces/Book';

const digitalBookSchema: Schema = new Schema<DigitalBook>({
  bookid: { type: String },
  title: { type: String, index: true },
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
  url: { type: String },
  cover: { type: String }
});
digitalBookSchema.index({ title: "text", author: "text" });
export const DigitalBookSchema = mongoose.model<DigitalBook>('DigitalBook', digitalBookSchema);

