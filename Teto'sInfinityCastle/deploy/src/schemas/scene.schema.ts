import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SceneDocument = HydratedDocument<Scene>;

@Schema()
export class Scene {
  @Prop({ type: [String], required: true })
  frames: string[];
}

export const SceneSchema = SchemaFactory.createForClass(Scene);
