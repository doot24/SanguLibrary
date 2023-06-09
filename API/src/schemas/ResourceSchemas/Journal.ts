import mongoose, { Schema } from 'mongoose';

import { Journal } from '../../interfaces/Resources/Journal';

import { resourceMetaSchema } from '../ResourceSchema';

const journalSchema: Schema = new Schema<Journal>({
  _id: { type: String },
  title: { type: String, index: true },
  resourceType: { type: Number },
  digital: { type: Boolean },
  subTitle: { type: String },
  authors: { type: [String], index: true },
  editors: { type: [String] },
  collegues: { type: [String] },
  description: { type: String },
  category: { type: String },
  number: { type: Number },
  issn: { type: String },
  publication: { type: String },
  publicationLocation: { type: String },
  publicationYear: { type: String },
  remark: { type: String },
  saveCipher: { type: String },
  resourceMeta: { type: resourceMetaSchema }
});
journalSchema.index({ title: "text", authors: "text", editors : 'text', collegues : 'text', issn: "text", saveCipher: 'text' });

export const JournalSchema = mongoose.model<Journal>('Journal', journalSchema);
