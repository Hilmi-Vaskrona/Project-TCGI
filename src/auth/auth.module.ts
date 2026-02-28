import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // `process.env.JWT_EXPIRES` comes in as a string (or undefined) so
      // coerce to a number when appropriate. JwtModule accepts
      // string or number, but using `Number(...)` avoids a TS type error
      // and allows us to provide a sane default if the env var isn't set.
      signOptions: {
        expiresIn:
          process.env.JWT_EXPIRES && !isNaN(Number(process.env.JWT_EXPIRES))
            ? Number(process.env.JWT_EXPIRES)
            : '60s', // default to 60 seconds if no valid value provided
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}