import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { I18nContext } from 'nestjs-i18n';
import { RedisCacheService } from 'src/cache/redisCache.service';
import { RedisUserInfo } from 'src/common/types/type';
import { Role } from 'src/models/enum.model';
import { PasswordService } from 'src/services/password.service';
import { PrismaService } from 'src/services/prisma.service';
import { CreateUserAccessTokenArgs } from './dto/args/create-user-access-token.args';
import { CreateUserArgs } from './dto/args/create-user.args';
import { JwtValidateArgs } from './dto/args/jwt-validate.args';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly redisCacheService: RedisCacheService,
    private readonly jwtService: JwtService,
  ) {}

  /* jwt 내용에 대한 결과값 */
  async jwtValidate(payload: JwtValidateArgs) {
    // if (payload.role === 'USER') {
    //   return await this.prisma.user.findUnique({ where: { id: payload.id } });
    // } else if (payload.role === 'ADMIN') {
    //   return await this.prisma.admin.findUnique({
    //     where: { id: payload.id },
    //   });
    // }
    return await this.prisma.user.findUnique({ where: { id: payload.id } });
  }

  // 로그인 요청 시 email, password 대조
  async validate(
    email: string,
    password: string,
    i18n: I18nContext,
  ): Promise<any> {
    const person = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!person) {
      throw new BadRequestException({
        message: i18n.t('error.NOT_FOUND_USER'),
        code: 'notFoundUser',
      });
    }

    // db가 대소문자 구분을 못해서
    if (email !== person.email) {
      throw new BadRequestException({
        message: i18n.t('error.NOT_FOUND_USER'),
        code: 'notFoundUser',
      });
    }

    // 입력된 비밀번호를 db의 해쉬화된 비밀번호와 대조
    const compareResult = await this.passwordService.validatePassword(
      password,
      person.password,
    );

    if (!compareResult) {
      throw new BadRequestException({
        message: i18n.t('error.PASSWORD_NOT_MATCH'),
        code: 'passwordNotMatch',
      });
    } else {
      const { password, ...result } = person;

      return result;
    }
  }

  async createUserAccessToken(
    i18n: I18nContext,
    { email, password }: CreateUserAccessTokenArgs,
  ) {
    // 회원 정보 대조
    const user = await this.validate(email, password, i18n);

    // 로그인 되어있는지 확인
    const userKey = `ACCESS_TOKEN=${email}`;

    // access-token : 1시간
    const accessTTL = 60 * 5;

    const payload = {
      id: user.id,
      email: user.email,
      role: Role.USER,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessTTL,
    });

    // refresh-token : 25시간
    const refreshTTL = 60 * 60;

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshTTL,
    });

    await this.redisCacheService.set(userKey, { accessToken }, accessTTL);

    return {
      accessToken,
      refreshToken,
    };
  }

  async createUser({ email, password }: CreateUserArgs) {
    const hashedPassword = await this.passwordService.hashPassword(password);

    await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return true;
  }
}
