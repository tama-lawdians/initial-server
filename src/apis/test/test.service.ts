import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { I18nContext } from 'nestjs-i18n';
import { PUB_SUB } from '../pub-sub/pub-sub.module';

@Injectable()
export class TestService {
  constructor(
    private httpService: HttpService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  sayTest(i18n: I18nContext) {
    console.log(i18n.lang);
    const text = i18n.t('error.HELLO');

    // throw new BadRequestException({
    //   message: `${i18n.t('error.HELLO')}`,
    //   code: 'no_auth',
    // });

    return text;
  }

  chat(message: string) {
    this.pubSub.publish('CHAT', { message });
    return true;
  }

  async hospitals() {
    const { data } = await this.httpService
      .get(
        'http://apis.data.go.kr/B551182/hospInfoService1/getHospBasisList1?pageNo=1&numOfRows=1000&_type=json&ServiceKey=Z2i9KN2ZaQt4Aqoe9x5fyh0%2BHdEFTD%2FbMXRqPBd5orxlw1Pu2SnmUkYV4UbjFPavLeGTs4pe%2BysKh4ckk4vRWg%3D%3D&yadmNm=%EA%B1%B4%EA%B5%AD',
        // 'http://apis.data.go.kr/B551182/codeInfoService/getAddrCodeList?addrTp=1&ServiceKey=Z2i9KN2ZaQt4Aqoe9x5fyh0%2BHdEFTD%2FbMXRqPBd5orxlw1Pu2SnmUkYV4UbjFPavLeGTs4pe%2BysKh4ckk4vRWg%3D%3D',
      )
      .toPromise();

    console.dir(data.response.body, { depth: null });
    // console.dir(data);
    return true;
  }
}
