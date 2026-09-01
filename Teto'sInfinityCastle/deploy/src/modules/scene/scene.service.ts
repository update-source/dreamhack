import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Scene } from 'src/schemas/scene.schema';
import { DEFAULT_SCENES } from 'src/common/constants';

@Injectable()
export class SceneService implements OnModuleInit {
  private readonly SCENES_LIST: { frames: string[] }[] = [];

  constructor(@InjectModel(Scene.name) private sceneModel: Model<Scene>) {}

  async onModuleInit() {
    const defaultScene = DEFAULT_SCENES;
    const reversedScene = DEFAULT_SCENES.toReversed();
    const randomScenes = Array.from({ length: 10 }, () => ({
      frames: this.generateScene(),
    }));

    this.SCENES_LIST.push(
      {
        frames: defaultScene,
      },
      {
        frames: reversedScene,
      },
      ...randomScenes,
    );

    await this.sceneModel.deleteMany({});
    await this.sceneModel.insertMany(this.SCENES_LIST);
  }

  generateScene() {
    const len = Math.floor(Math.random() * 34) + 10;
    const list = [
      'scene-1',
      'scene-2',
      'scene-3',
      'scene-4',
      'scene-5',
      'scene-6',
    ];
    const scenes = Array.from({ length: len }, () => {
      const randomIndex = Math.floor(Math.random() * list.length);
      return list[randomIndex];
    });
    return scenes;
  }

  getRandomScenes() {
    try {
      return this.SCENES_LIST[
        Math.floor(Math.random() * this.SCENES_LIST.length)
      ].frames;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllScene() {
    try {
      const scenes = await this.sceneModel.find();
      return scenes;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async addScene(scenes: number[]) {
    try {
      const newScenes = scenes.map((scene) => `scene-${scene}`);
      const ret = await this.sceneModel.create({
        frames: newScenes,
      });
      this.SCENES_LIST.push({
        frames: newScenes,
      });
      return ret;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
