import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from './common.constants';
import { MysqlService } from './mysql.service';
import * as mysql from 'mysql2/promise';

@Module({})
@Global()
export class MysqlModule {
  static forRoot(options: mysql.PoolOptions): DynamicModule {
    return {
      module: MysqlModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        MysqlService,
      ],
      exports: [MysqlService],
    };
  }
}
