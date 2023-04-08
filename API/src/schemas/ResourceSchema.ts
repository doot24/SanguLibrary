import mongoose, { Schema } from 'mongoose';

import { DigitalResource, ResourceMeta } from '../interfaces/Resources';

const resourceMetaSchema: Schema<ResourceMeta> = new Schema<ResourceMeta>({
  dateAdded: { type: Number, required: true },
  dateUpdated: { type: Number, required: true },
  updatedBy: { type: String, required: true },
  addedBy: { type: String, required: true },
  amount: { type: Number, required: true },
  amountLeft: { type: Number, required: true },
}, {_id : false});

const digitalResourceSchema: Schema<DigitalResource> = new Schema<DigitalResource>({
  coverURL: { type: String, required: true },
  fileURL: { type: String, required: true },
},{_id : false});

export {resourceMetaSchema, digitalResourceSchema}
