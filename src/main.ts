import { EnvironmentService } from '@core/environment';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableVersioning();

  const environmentService = app.get(EnvironmentService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const logger = app.get(Logger);
  const port = environmentService.getEnvironmentValue('PORT');

  if (environmentService.isSwaggerEnabled()) enableSwagger(app);

  await app.listen(port, () => {
    logger.log(`Listening on port ${port}`);
  });
}

function enableSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Fintual Tracker')
    .setDescription(
      'Tracker service for make extensive usage of the Fintual API',
    )
    .setExternalDoc('Postman collection', '/api-doc-json')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-doc', app, document);
}

bootstrap();
