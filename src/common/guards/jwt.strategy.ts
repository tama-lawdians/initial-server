import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/apis/auth/auth.service';
import { JwtValidateArgs } from 'src/apis/auth/dto/args/jwt-validate.args';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      // request 에서 jwt 추출하는 방법
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // false 시, 만료된 jwt가 왔을 경우 요청 거부
      ignoreExpiration: false,
      // 비밀키
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtValidateArgs) {
    const user = await this.authService.jwtValidate(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
