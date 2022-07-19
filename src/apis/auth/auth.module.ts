import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/common/guards/jwt.strategy';
import { PasswordService } from 'src/services/password.service';
import { PrismaService } from 'src/services/prisma.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          // signOptions: {
          //   expiresIn: '1m',
          // },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    PrismaService,
    PasswordService,
    JwtStrategy,
  ],
})
export class AuthModule {}
