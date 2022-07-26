import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from 'src/services/prisma.service';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('SERVICE_A') private clientA: ClientProxy,
  ) {}

  async getMyInfo(userId: string) {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }

  async getHello() {
    return this.clientA.send({ cmd: 'greeting' }, 'Progressive Coder');
  }

  async getHelloAsync() {
    const message = await this.clientA.send(
      { cmd: 'greeting-async' },
      'Progressive Coder',
    );
    return message;
  }

  pingServiceA() {
    const startTs = Date.now();
    const pattern = { cmd: 'ping' };
    const payload = {};
    return this.clientA
      .send<string>(pattern, payload)
      .pipe(
        map((message: string) => ({ message, duration: Date.now() - startTs })),
      );
  }
}
