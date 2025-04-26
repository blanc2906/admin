import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as dotenv from 'dotenv';
import * as fs from 'fs';

import { TAppConfig } from '@shared/config/app.config';
import { GlobalExceptionsFilter } from '@shared/filter/global-exception.filter';
import { CLogger } from '@shared/logger/custom-logger';

import { AppModule } from './app.module';
import { TransformInterceptor } from './shared/interceptors/transform-response.interceptor';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

async function bootstrap() {
  const options: NestApplicationOptions = {
    cors: true,
    logger: CLogger,
  };

  // Enable TLS
  if (process.env.ENABLE_TLS === 'true') {
    options.httpsOptions = {
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
    };
  }
  // End Enable TLS
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    options,
  );
  // Get app configs
  const configService = app.get(ConfigService);

  const host = configService.getOrThrow<TAppConfig>('app').host;
  const port = configService.getOrThrow<TAppConfig>('app').port;
  const apiPrefix = configService.getOrThrow<TAppConfig>('app').apiPrefix;
  // End Get app configs
  // Global setup
  app.setGlobalPrefix(apiPrefix);
  app.useGlobalFilters(new GlobalExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  //Validate global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger setup
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Yootek IOT Admin API')
      .setDescription('Api documents for Yootek IOT Platform')
      .setVersion('1.0')
      .addBearerAuth()
      .build(),
  );
  SwaggerModule.setup(apiPrefix, app, document);
  // End Swagger setup

  await app.startAllMicroservices();
  CLogger.log('Microservices are running', 'Bootstrap');

  await app.listen(port, host, () => {
    CLogger.log(`Server is running on ${host}:${port}`, 'Bootstrap');
  });
}
bootstrap();
