import mongoose, { Schema, Document } from 'mongoose';

import { IPetition, IPetitionTemplate } from '../interfaces/Petition';

const petitionSchema: Schema = new Schema<IPetition>({
  _id : {type : String},
  status : {type : String},
  template : {type : String},
  timestamp : {type : Number},
  owner : {type : String},
  text : {type : String},
  comment : {type : String}
});


const petitionTemplateSchema: Schema = new Schema<IPetitionTemplate>({
  _id : {type : String},
  title : {type : String},
  text : {type : String}
});

export const PetitionTemplateSchema = mongoose.model<IPetition>('PetitionTemplate', petitionTemplateSchema);
export const PetitionSchema = mongoose.model<IPetition>('Petition', petitionSchema);

