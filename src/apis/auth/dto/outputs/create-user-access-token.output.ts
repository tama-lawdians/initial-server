import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateUserAccessTokenOutput {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
