import { BadRequestException, Injectable } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class TestService {
  sayTest(i18n: I18nContext) {
    console.log(i18n.lang);
    const text = i18n.t('error.HELLO');

    throw new BadRequestException({
      message: `${i18n.t('error.HELLO')}`,
      code: 'no_auth',
    });

    return text;
  }
}
