import { Config } from './config.interface';

const config: Config = {
  graphql: {
    playgroundEnabled: process.env.NODE_ENV === 'dev' ? true : false,
    // stacktrace 전송 여부
    debug: process.env.NODE_ENV === 'dev' ? true : false,
    schemaDestination: './src/schema.graphql',
    sortSchema: false,
  },
};

export default (): Config => config;
