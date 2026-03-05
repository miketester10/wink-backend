import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env, isDevelopment } from './common/config';
import { SuccessResponseInterceptor } from './common/interceptors';
import { ErrorResponseFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Imposta prefisso globale
  app.setGlobalPrefix(env.API_PREFIX);

  // Abilita la validazione globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Abilita CORS
  app.enableCors({
    origin: isDevelopment
      ? true // Accetta tutte le origini in development
      : ['https://www.wink-application-test.it'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Configura ed abilita Swagger
  const config = new DocumentBuilder()
    .setTitle('WiNK Backend API')
    .setDescription(
      'REST API demo per il progetto WiNK, sviluppato con NestJS e TypeScript',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(env.API_PREFIX + '/docs', app, document);

  // Abilita Interceptor e Filter globali
  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  app.useGlobalFilters(new ErrorResponseFilter());

  // Avvia l'applicazione
  await app.listen(env.PORT);
}
void bootstrap();
