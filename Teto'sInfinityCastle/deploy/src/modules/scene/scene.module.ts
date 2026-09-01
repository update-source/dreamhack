import { Module } from '@nestjs/common';
import { SceneService } from './scene.service';
import { SceneController } from './scene.controller';
import { Scene, SceneSchema } from 'src/schemas/scene.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Scene.name, schema: SceneSchema }]),
  ],
  controllers: [SceneController],
  providers: [SceneService],
})
export class SceneModule {}
