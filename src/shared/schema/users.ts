//users-schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';
import { UserRole } from 'src/shared/enums/UserRole.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, enum: UserRole })
  role: UserRole;

  @Prop({ type: String, required: true })
  password: string;
}

export const userSchema = SchemaFactory.createForClass(User);
