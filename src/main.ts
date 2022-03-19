import { configure } from './configure';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { transports, format } from 'winston';
import { ConfigService } from '@nestjs/config';
import { WinstonModule, utilities } from 'nest-winston';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const loggerInit = [
    new transports.Console({
      level: 'silly',
      format: format.combine(format.timestamp(), utilities.format.nestLike()),
    }),
  ];
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      transports: loggerInit,
      exceptionHandlers: loggerInit,
    }),
  });

  const configService = app.get<ConfigService>(ConfigService);

  await configure(app);

  app.enableShutdownHooks();

  await app.listen(configService.get('app.port'));
}

bootstrap();
