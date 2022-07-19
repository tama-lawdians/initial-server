export interface Config {
  graphql: GraphQLConfig;
}

export interface GraphQLConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}
