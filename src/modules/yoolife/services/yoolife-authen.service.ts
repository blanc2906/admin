import { Injectable, OnModuleInit } from '@nestjs/common';
import { MConfigService } from '@m-config/services/config.service';
import axios from 'axios';

@Injectable()
export class YoolifeAuthenticateService implements OnModuleInit {
  constructor(private readonly mconfigService: MConfigService) {}
  
  YOOLIFE_URL_PATH: string;
  YOOLIFE_ACCOUNT: string;
  YOOLIFE_PASSWORD: string;
  private accessToken: string;

  async onModuleInit() {
    this.YOOLIFE_URL_PATH = await this.mconfigService.get<string>('YOOLIFE_URL');
    this.YOOLIFE_ACCOUNT = await this.mconfigService.get<string>('YOOLIFE_ACCOUNT');
    this.YOOLIFE_PASSWORD = await this.mconfigService.get<string>('YOOLIFE_PASSWORD');
  }

  async authenticate() {
    try {
      if (this.accessToken) {
        return this.accessToken;
      }

      const response = await axios.post(
        `${this.YOOLIFE_URL_PATH}/api/TokenAuth/Authenticate`,
        {
          userNameOrEmailAddress: this.YOOLIFE_ACCOUNT,
          password: this.YOOLIFE_PASSWORD,
        },
      );

      this.accessToken = response.data.result.accessToken;
      return this.accessToken;
    } catch (error) {
      console.error('Authentication Error:', error.response?.data || error.message);
      throw new Error('Authentication failed');
    }
  }

  async getAccessToken(refreshToken: string) {
    try {
      const response = await axios.post(
        `${this.YOOLIFE_URL_PATH}/api/TokenAuth/RefreshToken`,
        {
          refreshToken,
        },
      );

      this.accessToken = response.data.result.accessToken;
      return this.accessToken;
    } catch (error) {
      console.error('Refresh Token Error:', error.response?.data || error.message);
      throw new Error('Failed to refresh token');
    }
  }
}
