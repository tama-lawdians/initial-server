import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  // id
  id: string;

  @Field(() => Int)
  no: number;

  // 로그인 이메일
  @Field(() => Int)
  email: string;

  // 로그인 비밀번호
  password: string;

  @Field({ description: '생성일' })
  createdAt: Date;

  @Field({ description: '수정일' })
  updatedAt: Date;
}
