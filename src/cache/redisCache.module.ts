import { Module, CacheModule, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisCacheService } from './redisCache.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
