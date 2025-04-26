import { Injectable, OnModuleInit } from '@nestjs/common';
import { MConfigService } from '@m-config/services/config.service';
import axios from 'axios';

@Injectable()
export class YoolifeAuthenticateService implements OnModuleInit {
  constructor(private readonly mconfigService: MConfigService) {}
  
  YOOLIFE_URL_PATH: string;
  YOOLIFE_ACCOUNT: string;
  YOOLIFE_PASSWORD: string;
  
  private accessToken: string = null;
  private expiresAt: number = null;

  async onModuleInit() {
    this.YOOLIFE_URL_PATH = await this.mconfigService.get<string>('YOOLIFE_URL');
    this.YOOLIFE_ACCOUNT = await this.mconfigService.get<string>('YOOLIFE_ACCOUNT');
    this.YOOLIFE_PASSWORD = await this.mconfigService.get<string>('YOOLIFE_PASSWORD');
    
    try {
      await this.authenticate();
    } catch (error) {
      console.error('Initial authentication failed:', error.message);
    }
  }

  private isTokenExpired(): boolean {
    if (!this.accessToken || !this.expiresAt) return true;
    return Date.now() >= this.expiresAt;
  }

  async authenticate() {
    try {
      if (this.accessToken && !this.isTokenExpired()) {
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
      const expireInSeconds = response.data.result.expireInSeconds;
    
      this.expiresAt = Date.now() + (expireInSeconds * 1000);
      
      return this.accessToken;
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }
}
