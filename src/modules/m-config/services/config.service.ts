import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "@prisma/services/prisma.service";
import { Cache } from 'cache-manager';
import { validateSync } from 'class-validator';
import { ConfigurationRule } from '../dto/common.dto';
import { configurations,RuleInstance } from '../configurations/_index'

@Injectable()
export class MConfigService implements OnModuleInit {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly prismaService: PrismaService,
    ) { }

    async onModuleInit() {
        const variables = await this.prismaService.configuration.findMany();
        variables.forEach(variable => {
            this.cacheManager.set(variable.key, variable.value);
        });
    }

    async get<T>(key: string): Promise<T> {
        let value = await this.cacheManager.get(key);
        if (!value) {
            const variable = await this.prismaService.configuration.findUnique({ where: { key } });
            if (variable) {
                value = variable.value;
                await this.cacheManager.set(key, value);
            } else {
                throw new Error(`Configuration variable with key ${key} not found in database`);
            }
        }
        return value as T;
    }

    async getConfig<T>(rule: ConfigurationRule<T>): Promise<T> {
        const configInstance = new rule.configClass();
        for (const [key, envKey] of Object.entries(rule.keys)) {
            const value = await this.get(envKey);
            configInstance[key] = value;
        }        
        const errors = validateSync(configInstance as object);
        if (errors.length > 0) {
            throw new Error(`Validation failed for configuration: ${errors}`);
        }

        const finalConfig = new rule.configClass();
        for (const [key, envKey] of Object.entries(rule.keys)) {
            finalConfig[key] = configInstance[key];
        }

        return finalConfig;
    }

    async loadAllConfigs() {
        for (const config of configurations) {
            const configInstance = await this.getConfig<RuleInstance>(config);
            for (const [key, value] of Object.entries(config.keys)) {
                if (!configInstance[key]) {
                    throw new Error(`Missing required configuration key: ${value}`);
                }
            }          
            //Save the config instance to the cache
            this.cacheManager.set(config.name, configInstance);
        }
    }
    async getConfigurationsByName<T>(name: string): Promise<T> {
        const configInstance = await this.cacheManager.get(name);
        if (!configInstance) {
            throw new Error(`Configuration with name ${name} not found`);
        }
        return configInstance as T;
    }
}