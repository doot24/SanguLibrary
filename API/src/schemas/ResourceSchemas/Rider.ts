import mongoose, { Schema } from 'mongoose';

import { Rider } from '../../interfaces/Resources/Rider';

import { digitalResourceSchema, resourceMetaSchema } from '../ResourceSchema';

const riderSchema: Schema = new Schema<Rider>({
    _id: { type: String },
    title: { type: String, index: true },
    resourceType: {type : Number},
    digital : {type : Boolean},
    author : {type : String},
    subTitle: { type: String },
    remark: { type: String },
    saveCipher: { type: String },
    resourceMeta : {type : resourceMetaSchema},
    digitalResouce : {type : digitalResourceSchema}
  });
  
  export const RiderSchema = mongoose.model<Rider>('Rider', riderSchema);
  