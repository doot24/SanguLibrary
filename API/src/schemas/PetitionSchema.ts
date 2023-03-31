import mongoose, { Schema, Document } from 'mongoose';

import { Petition, PetitionTemplate } from '../interfaces/Petition';

const petitionSchema: Schema = new Schema<Petition>({
  _id : {type : String},
  status : {type : String},
  template : {type : String},
  timestamp : {type : Number},
  owner : {type : String},
  text : {type : String},
  comment : {type : String}
});

const petitionTemplateSchema: Schema = new Schema<PetitionTemplate>({
  _id : {type : String},
  title : {type : String},
  text : {type : String}
});

export const PetitionTemplateSchema = mongoose.model<PetitionTemplate>('PetitionTemplate', petitionTemplateSchema);
export const PetitionSchema = mongoose.model<Petition>('Petition', petitionSchema);

