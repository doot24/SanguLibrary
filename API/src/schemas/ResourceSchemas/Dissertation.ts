import mongoose, { Schema } from 'mongoose';

import { Dissertation } from '../../interfaces/Resources/Dissertation';

import { resourceMetaSchema } from '../ResourceSchema';

const dissertationSchema: Schema = new Schema<Dissertation>({
  _id : {type : String},
  resourceType: {type : Number},
  title: {type : String},
  subTitle: {type : String},
  professor: {type : String},
  publicationYear: {type : Number},
  saveCipher: {type : String},
  resourceMeta : {type : resourceMetaSchema}
});
dissertationSchema.index({ title: "text", professor: "text", saveCipher : "text"});
  
export const DissertationSchema = mongoose.model<Dissertation>('Dissertation', dissertationSchema);
  