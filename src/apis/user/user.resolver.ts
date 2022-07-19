import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { User } from 'src/models/user.model';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { description: '내 정보 조회' })
  @UseGuards(GqlAuthGuard)
  getMyInfo(@CurrentUser() user: User) {
    return this.userService.getMyInfo(user.id);
  }
}
