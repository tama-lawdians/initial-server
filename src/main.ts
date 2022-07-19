import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { GraphQLConfig } from './configs/env/config.interface';
import helmet from 'helmet';
import * as compression from 'compression';
import { json, urlencoded } from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import {
  i18nValidationErrorFactory,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // forbidNonWhitelisted: true, // whitelist 설정을 켜서 걸러질 속성이 있다면 아예 요청 자체를 막도록 (400 에러). true이면, argsType 안에서의 inputType 이 property should not exist 에러 남
      // whitelist: true, // validation을 위한 decorator가 붙어있지 않은 속성들은 제거. true이면, input은 통과하는데 undefined 가 반환
      transform: true, // 요청에서 넘어온 자료들의 형변환
      exceptionFactory: i18nValidationErrorFactory,
    }),
  );

  app.useGlobalFilters(new I18nValidationExceptionFilter());

  const configService = app.get(ConfigService);
  const graphqlConfig = configService.get<GraphQLConfig>('graphql');

  if (!graphqlConfig.playgroundEnabled) {
    app.use(helmet());
  }

  // 데이터 압축
  app.use(compression());

  app.use(
    json({
      limit: '50mb',
    }),
  );

  app.use(
    urlencoded({
      limit: '50mb',
      parameterLimit: 100000,
      extended: true,
    }),
  );

  // 파일 업로드
  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 10 * 1024 * 1024, maxFiles: 10 }),
  );

  await app.listen(configService.get('PORT'));
}
bootstrap();
