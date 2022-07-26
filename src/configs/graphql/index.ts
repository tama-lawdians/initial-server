import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { GraphQLConfig } from '../env/config.interface';
// import * as NoIntrospection from 'graphql-disable-introspection';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import e from 'express';

@Injectable()
export class GraphqlService implements GqlOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async createGqlOptions(): Promise<ApolloDriverConfig> {
    const graphqlConfig = this.configService.get<GraphQLConfig>('graphql');

    return {
      path: '/graphql',
      // uploads: false,
      // installSubscriptionHandlers: true,
      // buildSchemaOptions: {
      //   numberScalarMode: 'float',
      // },
      sortSchema: graphqlConfig.sortSchema,
      autoSchemaFile: graphqlConfig.schemaDestination,
      debug: graphqlConfig.debug,
      playground: graphqlConfig.playgroundEnabled,
      context: ({ req }) => ({ req }),
      subscriptions: {
        'graphql-ws': {
          onConnect: (ctx) => {
            console.log({ ctx });
            // TODO: 여기서 헤더에 담겨오는 토큰으로 subscription 연결 자체를 제한할 수 있다.
          },
        },
        // apollo 3 버전에서는 얘를 넣어줘야 playground 에서 가능
        // But, client 쪽에서는 쓰지 말기!!
        // only 백엔드 playground subscription 용
        'subscriptions-transport-ws': true,
      },
      // validationRules:
      //   process.env.NODE_ENV === 'dev' ? null : [NoIntrospection],
      formatError: (error: GraphQLError) => {
        console.dir(error, { depth: null });

        // Unauthorized
        if (error.extensions.code === 'UNAUTHENTICATED') {
          const graphQLFormattedError: GraphQLFormattedError = {
            message: 'Unauthorized',
            extensions: { code: 'UNAUTHENTICATED' },
          };

          return graphQLFormattedError;
        }

        let message = error.extensions?.exception['response']
          ? error.extensions?.exception['response']['message']
          : error.message; // throw Error 시에는 error.message 가 존재

        let code =
          (error.extensions?.exception &&
            error.extensions.exception['response'] &&
            error.extensions.exception['response']['code']) ??
          error.extensions.code;

        // DTO Validate 단에서는 error.message가 아니고 extensions.exception 로 빠진다
        if (
          error.extensions.code === 'INTERNAL_SERVER_ERROR' &&
          error.extensions.exception.errors
        ) {
          if (error.extensions.exception.errors.length > 0) {
            Object.keys(
              error.extensions.exception.errors[0].constraints,
            ).forEach((key) => {
              message = error.extensions.exception.errors[0].constraints[key];
            });
          }
        }

        const graphQLFormattedError: GraphQLFormattedError = {
          message,
          extensions: { code },
        };

        return graphQLFormattedError;
      },
    };
  }
}
