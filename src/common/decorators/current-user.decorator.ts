import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // rest api request
    const request = context.switchToHttp().getRequest();

    // graphql request
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext?.req?.user || request?.user;

    return user;
  },
);
