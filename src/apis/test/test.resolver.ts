import { Query, Resolver } from '@nestjs/graphql';
import { TestService } from './test.service';
import { I18n, I18nContext } from 'nestjs-i18n';

@Resolver()
export class TestResolver {
  constructor(private readonly testService: TestService) {}

  @Query(() => String)
  sayTest(@I18n() i18n: I18nContext) {
    return this.testService.sayTest(i18n);
  }
}
