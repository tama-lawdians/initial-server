import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './configs/env/config';
import { GraphqlService } from './configs/graphql';
import { TestModule } from './apis/test/test.module';
import { LoggingPlugin } from './common/plugins/logging.plugin';
import { RedisCacheModule } from './cache/redisCache.module';
import { AuthModule } from './apis/auth/auth.module';
import * as path from 'path';
import {
  I18nModule,
  QueryResolver,
  HeaderResolver,
  CookieResolver,
  AcceptLanguageResolver,
} from 'nestjs-i18n';
import { UserModule } from './apis/user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MysqlModule } from './apis/mysql/mysql.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
    }),
    GraphQLModule.forRootAsync({
      // driver는 useClass 내에 있을 경우, 인식하지 못한다.
      driver: ApolloDriver,
      useClass: GraphqlService,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en', // Accept-Language 데이터가 없을 경우, default
      formatter: (template: string, ...args: any[]) => template,
      // fallbacks: {
      //   'en-CA': 'fr',
      //   'en-*': 'en',
      //   'fr-*': 'fr',
      //   pt: 'pt-BR',
      // },
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(),
        AcceptLanguageResolver,
      ],
    }),
    MysqlModule.forRoot({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      port: +process.env.MYSQL_PORT,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      connectionLimit: +process.env.MYSQL_CONNECTION_LIMIT,
      waitForConnections:
        process.env.MYSQL_WAIT_FOR_CONNECTIONS === 'true' ? true : false,
    }),
    TestModule,
    RedisCacheModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggingPlugin],
})
export class AppModule {}
