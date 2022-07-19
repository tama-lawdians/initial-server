import { Plugin } from '@nestjs/apollo';
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
  GraphQLRequestContextWillSendResponse,
  BaseContext,
} from 'apollo-server-plugin-base';
import * as moment from 'moment-timezone';
import { getIpAddress } from 'src/utils/convert';

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
  async requestDidStart(requestContext): Promise<GraphQLRequestListener> {
    // ip
    const ipAddress = `${getIpAddress(requestContext.context.req)} `;

    // 유저 id
    const userId = requestContext.context.req?.user?.id ?? 'ANY ';

    // 일반회원, 관리자 여부
    const role = requestContext.context.req?.user?.role ?? 'ANY ';

    // 리졸버 이름
    const operationName = requestContext.request.operationName;

    // 현재 시간
    const now = moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');

    // 일반 로그 또는 에러
    let kind = '[REQUEST] ';

    // 로그 변수
    const log = now + ' ' + kind + ipAddress + role + userId + operationName;

    requestContext.logger.info(log);

    return {
      async willSendResponse(
        ctx: GraphQLRequestContextWillSendResponse<BaseContext>,
      ) {
        let errors = '';

        let kind = '[SUCCESS] ';
        if (ctx.errors && ctx.errors.length > 0) {
          kind = '[ERROR] ';

          if (ctx?.response?.errors && ctx.response.errors.length > 0) {
            ctx.response.errors.forEach((item) => {
              errors = item.message;
            });
          }
        }
        // 로그 변수
        const log =
          now +
          ' ' +
          kind +
          ipAddress +
          role +
          userId +
          operationName +
          ' ' +
          errors;

        ctx.logger.info(log);
      },
    };
  }
}
