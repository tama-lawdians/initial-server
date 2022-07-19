import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RedisCacheService } from 'src/cache/redisCache.service';
import { Role } from 'src/models/enum.model';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    // rest api request
    const request = context.switchToHttp().getRequest();

    // graphql request
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const authorization =
      gqlContext?.req?.headers['authorization'] ||
      request?.headers['authorization'];
    const token = authorization.split(' ')[1];
    const user = gqlContext?.req?.user || request?.user;
    if (!user) {
      return false;
    }

    // 헤더에 토큰이 없는 경우
    if (!token) {
      return false;
    }

    // 관리자일 경우 redis에서 중복검사
    if (user.role === Role.ADMIN) {
      const getTTL = await this.redisCacheService.ttl(user.id);
      if (getTTL < 0) {
        throw new UnauthorizedException({
          message: 'Unauthorized',
        });
      }

      const getUserToken = await this.redisCacheService.get(user.id);
      if (getUserToken !== token) {
        throw new UnauthorizedException({
          message: 'DUPLICATED_LOGGED_IN',
        });
      }
    }

    if (requiredRoles.some((role) => user.role?.includes(role))) {
      return true;
    } else {
      throw new UnauthorizedException({
        message: '접근 권한이 없습니다.',
      });
    }
  }
}
