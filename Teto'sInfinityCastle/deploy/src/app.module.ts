import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { SceneModule } from './modules/scene/scene.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import initDB from './config/database';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'views'),
      exclude: ['/api/{*name}'],
      serveStaticOptions: {
        fallthrough: false,
      },
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const uri = await initDB();
        return {
          uri: uri,
        };
      },
    }),
    AuthModule,
    SceneModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
