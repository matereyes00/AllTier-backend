import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/modules/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TierListInterceptor } from './infrastructure/http/interceptors/tier.lists.interceptor';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // app.useGlobalInterceptors(new TierListInterceptor());

   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const config = new DocumentBuilder()
    .setTitle('AllTier API Documentation')
    .setDescription('The AllTier API documentation')
    .setVersion('1.0')
    .addTag('AllTier')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
