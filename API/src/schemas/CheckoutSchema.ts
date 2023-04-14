import mongoose, { Schema, Document } from 'mongoose';
import { Checkout } from '../interfaces/Checkout';

const checkoutSchema: Schema = new Schema<Checkout>({
  _id : { type: String},
  employee : { type: String },
  student : { type: String },
  resource : {type : Number},
  resource_id : { type: String },
  dateIssued : { type: String },
  returnDate : {type : String}
});

export const CheckoutSchema = mongoose.model<Checkout>('Checkout', checkoutSchema);

