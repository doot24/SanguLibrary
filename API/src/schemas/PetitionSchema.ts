import mongoose, { Schema, Document } from 'mongoose';

import { Petition, PetitionTemplate, CheckoutPetition } from '../interfaces/Petition';

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

const checkoutPetitionSchema: Schema = new Schema<CheckoutPetition>({
  _id : {type : String},
  status : {type : String},
  template : {type : String},
  timestamp : {type : Number},
  owner : {type : String},
  text : {type : String},
  comment : {type : String},
  
  system : {type : Boolean},
  resource_type : {type : Number},
  resource_id : {type : String}
});

export const PetitionTemplateSchema = mongoose.model<PetitionTemplate>('PetitionTemplate', petitionTemplateSchema, "petitiontemplates");
export const PetitionSchema = mongoose.model<Petition>('Petition', petitionSchema, "petitions");
export const CheckoutPetitionSchema = mongoose.model<CheckoutPetition>('CheckoutPetition', checkoutPetitionSchema,"petitions");

