import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T> {
    return await this.cacheManager.get(key);
  }

  // cache server에 key-value 형태로 데이터를 저장합니다.
  async set(key: string, value: any, accessTTL?: number) {
    await this.cacheManager.set(key, value, { ttl: accessTTL });
  }

  // cache 의 ttl 정의
  async ttl(key: string) {
    const result = await this.cacheManager.store.ttl(key);

    return result;
  }

  // cache 의 key-value 삭제
  async del(key: string) {
    await this.cacheManager.del(key);
  }
}
