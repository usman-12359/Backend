import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { config } from './config';
import * as cors from 'cors';
import { TransformInterceptor } from './interceptors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import { CustomLogger } from './services/customLogger';
import { morganMiddleware } from './interceptors/morgon-middleware';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
// import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger(config.SERVICE_NAME);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: new CustomLogger(), // Use the custom logger
  });

  app.use(morganMiddleware); // Use Morgan middleware
  // const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.startAllMicroservices();
  app.useGlobalInterceptors(new TransformInterceptor());
  // app.use(helmet());
  app.use(cors({
    origin: '*',
    // origin: ['https://stg.chegousuaencomenda.com.br', 'https://dev.chegousuaencomenda.com.br/'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
    credentials: true
  }));
  app.use(compression());
  
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // This will be the URL prefix
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Delivery Application')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.PORT, () =>
    logger.verbose(`App started on port: ${config.PORT}`),
  );
}
bootstrap();
