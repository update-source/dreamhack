import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Body,
  Post,
} from '@nestjs/common';
import { SceneService } from './scene.service';
import { AuthGuard } from 'src/vendors/guards/auth.guard';
import { ROLES } from 'src/common/constants';
import { Roles } from 'src/vendors/decorators/role.decorator';
import { RolesGuard } from 'src/vendors/guards/role.guard';
import { AddSceneDto } from './dto/add-scene.dto';

@Controller('scene')
@UseGuards(AuthGuard, RolesGuard)
export class SceneController {
  constructor(private readonly sceneService: SceneService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/random')
  getRandomScenes() {
    return this.sceneService.getRandomScenes();
  }

  @HttpCode(HttpStatus.OK)
  @Roles([ROLES.ADMIN])
  @Get('')
  getAllScene() {
    return this.sceneService.getAllScene();
  }

  @HttpCode(HttpStatus.OK)
  @Roles([ROLES.ADMIN])
  @Post('')
  addScene(@Body() body: AddSceneDto) {
    return this.sceneService.addScene(body.scenes);
  }
}
