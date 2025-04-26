import { ConfigurationRule } from '@m-config/dto/common.dto';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthCF {
  @IsString()
  @IsNotEmpty()
  jwtToken: string;

  //@IsInt()
  @IsOptional()
  accessTokenExpireIN?: number;

  //@IsInt()
  @IsOptional()
  refreshTokenExpireIn?: number;
}

export const authConfigurations = new ConfigurationRule<AuthCF>(
  'auth',
  {
    jwtToken: 'JWT_SECRET_TOKEN',
    accessTokenExpireIN: 'ACCESS_TOKEN_EXPIRE_IN',
    refreshTokenExpireIn: 'REFRESH_TOKEN_EXPIRE_IN',
  },
  AuthCF,
);
