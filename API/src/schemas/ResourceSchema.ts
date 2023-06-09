import mongoose, { Schema } from 'mongoose';

import { ResourceMeta } from '../interfaces/Resources';

const resourceMetaSchema: Schema<ResourceMeta> = new Schema<ResourceMeta>({
  dateAdded: { type: Number, required: true },
  dateUpdated: { type: Number, required: true },
  updatedBy: { type: String, required: true },
  addedBy: { type: String, required: true },
}, {_id : false});

export {resourceMetaSchema}
