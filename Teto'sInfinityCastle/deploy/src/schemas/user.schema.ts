import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ROLES } from 'src/common/constants';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true, trim: true })
  username: string;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop({ default: ROLES.USER, enum: ROLES })
  role: ROLES;
}

export const UserSchema = SchemaFactory.createForClass(User);
