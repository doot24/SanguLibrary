import mongoose, { Schema } from 'mongoose';

import { Dissertation } from '../../interfaces/Resources/Dissertation';

import { digitalResourceSchema, resourceMetaSchema } from '../ResourceSchema';

const dissertationSchema: Schema = new Schema<Dissertation>({
  _id : {type : String},
  digital : {type : Boolean, default : true},
  resourceType: {type : Number},
  title: {type : String},
  subTitle: {type : String},
  professor: {type : String},
  publicationYear: {type : Number},
  saveCipher: {type : String},
  resourceMeta : {type : resourceMetaSchema},
  digitalResource : {type : digitalResourceSchema}
});
dissertationSchema.index({ title: "text", professor: "text", saveCipher : "text"});
  
export const DissertationSchema = mongoose.model<Dissertation>('Dissertation', dissertationSchema);
  