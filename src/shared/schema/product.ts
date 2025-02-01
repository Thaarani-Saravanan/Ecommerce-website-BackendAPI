//product-schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './users';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  expiryDate: Date;

  @Prop({ required: true })
  oldPrice: number;

  @Prop({ required: true })
  newPrice: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => User.name,
    required: true,
  })
  userId: User;

  @Prop()
    vendorId: string; 

  @Prop({ required: true })
  freeDelivery: boolean;

  @Prop({ required: false })
  deliveryAmount: number;

  @Prop({ required: true })
  productUrl: string;

  @Prop({ required: true })
  images: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
