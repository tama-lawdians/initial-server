import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { QueryInterface } from './dto/interfaces/query.interface';
import { CONFIG_OPTIONS } from './common.constants';

@Injectable()
export class MysqlService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: mysql.PoolOptions,
  ) {
    this.POOL = mysql.createPool(this.options);
  }
  private POOL: mysql.Pool;

  async getConnection(): Promise<mysql.PoolConnection> {
    return await this.POOL.getConnection().catch((e) => {
      console.log(e);
      throw new ServiceUnavailableException({
        message:
          '사용량이 많아 연결을 실패하였습니다.\n잠시 후 다시 시도해주시기 바랍니다.',
      });
    });
  }

  async query(data: QueryInterface) {
    const { sql, value } = data;
    const conn = data.conn || this.POOL;

    const [result] = await conn.query(sql, value);

    return result;
  }

  async execute(data: QueryInterface) {
    const { sql, value } = data;
    const conn = data.conn || this.POOL;

    const [result] = await conn.execute(sql, value);

    if (result.changedRows === 0) {
      console.log('execute error');

      throw new BadRequestException({
        message:
          '일시적인 오류가 발생했습니다.\n잠시 후 다시 시도해주시기 바랍니다.',
      });
    }

    return result;
  }

  async transaction(conn: mysql.PoolConnection): Promise<void> {
    return await conn.beginTransaction();
  }

  async commit(conn: mysql.PoolConnection): Promise<void> {
    return await conn.commit();
  }

  async rollback(conn: mysql.PoolConnection): Promise<void> {
    return await conn.rollback();
  }

  async release(conn: mysql.PoolConnection): Promise<void> {
    conn.release();
  }
}
