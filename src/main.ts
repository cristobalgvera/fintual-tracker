import { EnvironmentService } from '@core/environment';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // TODO: Add proper global prefix
  app.setGlobalPrefix('SERVICE_PREFIX');
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

  if (environmentService.isSwaggerEnabled()) enableSwagger(app, port, logger);

  await app.listen(port, () => {
    logger.log(`Listening on port ${port}`);
  });
}

function enableSwagger(app: INestApplication, port: number, logger: Logger) {
  const config = new DocumentBuilder()
    // TODO: add proper service name
    .setTitle('SERVICE_NAME')
    .setDescription('SERVICE_DESCRIPTION')
    .setVersion('1.0')
    .setExternalDoc('Postman collection', '/api-doc-json')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  logger.log(`[Swagger URL]: http://localhost:${port}/api-doc`);
  logger.log(`[Postman JSON]: http://localhost:${port}/api-doc-json`);

  SwaggerModule.setup('api-doc', app, document);
}

bootstrap();
