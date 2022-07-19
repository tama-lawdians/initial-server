import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@ArgsType()
export class CreateUserAccessTokenArgs {
  @Field()
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('error.INVALID_EMAIL'),
    },
  )
  email: string;

  @Field()
  @IsString()
  @Length(6, 12, {
    message: i18nValidationMessage('error.INVALID_PASSWORD_FORMAT'),
  })
  password: string;
}
