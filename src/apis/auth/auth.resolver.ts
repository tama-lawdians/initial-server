import { Args, Query, Resolver } from '@nestjs/graphql';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthService } from './auth.service';
import { CreateUserAccessTokenArgs } from './dto/args/create-user-access-token.args';
import { CreateUserArgs } from './dto/args/create-user.args';
import { CreateUserAccessTokenOutput } from './dto/outputs/create-user-access-token.output';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => CreateUserAccessTokenOutput, {
    description: '유저 액세스 토큰 생성',
  })
  createUserAccessToken(
    @I18n() i18n: I18nContext,
    @Args() data: CreateUserAccessTokenArgs,
  ) {
    return this.authService.createUserAccessToken(i18n, data);
  }

  @Query(() => Boolean, { description: '유저 생성' })
  createUser(@Args() data: CreateUserArgs) {
    return this.authService.createUser(data);
  }
}
