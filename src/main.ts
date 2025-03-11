import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import configuration from './config/configuration';
const config = configuration();


dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['debug', 'error', 'warn', 'log'] });


  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );



  const configApi = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API documentation for the NestJS application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, configApi);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

}

bootstrap();
