import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { TestService } from './test.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from '../pub-sub/pub-sub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver()
export class TestResolver {
  constructor(
    private readonly testService: TestService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {}

  @Query(() => String)
  sayTest(@I18n() i18n: I18nContext) {
    return this.testService.sayTest(i18n);
  }

  @Query(() => Boolean)
  hospitals() {
    return this.testService.hospitals();
  }

  @Mutation(() => Boolean)
  chat(@Args('message') message: string) {
    return this.testService.chat(message);
  }

  // cms - 채팅 내용 구독
  @Subscription(() => String, {
    resolve: (value) => {
      console.log({ value });
      return value.message;
    },
  })
  // @UseGuards(GqlAuthGuard, DuplicationGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  async chatSub() {
    return this.pubSub.asyncIterator(`CHAT`);
  }
}
