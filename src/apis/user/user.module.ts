import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SERVICE_A',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8888,
        },
      },
    ]),
  ],
  providers: [UserResolver, UserService, PrismaService],
  controllers: [UserController],
})
export class UserModule {}
