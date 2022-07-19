import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyInfo(userId: string) {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }
}
