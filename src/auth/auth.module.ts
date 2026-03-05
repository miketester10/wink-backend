import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { env } from '../common/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: env.JWT_SECRET,
        global: true,
        signOptions: {
          expiresIn: `${env.JWT_EXPIRES_IN}h`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
