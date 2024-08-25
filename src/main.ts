import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['bvkdfn'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //для ігнорування не правильних полів/полів яких нема в дто
    }),
  );
  await app.listen(3000);
}
bootstrap();
