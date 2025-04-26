import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '@auth/services/auth.service';
import { Strategy } from 'passport-local';

import { CUnauthorizedException } from '@shared/exception/http.exception';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const admin = await this.authService.validateAdmin(email, password);
    if (!admin) {
      throw new CUnauthorizedException(
        'LocalStrategy',
        'Email hoặc mật khẩu không đúng',
      );
    }
    return admin;
  }
}
