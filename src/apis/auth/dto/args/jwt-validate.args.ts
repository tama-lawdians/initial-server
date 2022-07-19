import { ArgsType, Field } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { Role } from 'src/models/enum.model';

@ArgsType()
export class JwtValidateArgs {
  @Field()
  @IsString()
  id: string;

  @Field()
  @IsString()
  email: string;

  @Field()
  @IsEnum(Role, { message: '올바른 권한명이 아닙니다.' })
  role: Role;
}
