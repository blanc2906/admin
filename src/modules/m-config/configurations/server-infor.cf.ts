import { ConfigurationRule } from "@m-config/dto/common.dto";
import { IsOptional, IsString } from "class-validator";


export class ServerInforCF{
    name: string
    host: string
    port: string
    prefix: string
    enableTls:string
    sslCertPath: string
    sslKeyPath: string
}
export const serverInforConfigurations= new ConfigurationRule<ServerInforCF>("serverInfor",{
    name: 'SERVER_NAME',
    host: 'SERVER_HOST',
    port: 'SERVER_PORT',
    prefix: 'SERVER_API_PREFIX',
    enableTls: 'SERVER_ENABLE_TLS',
    sslCertPath: 'SERVER_SSL_CERT_PATH',
    sslKeyPath: 'SERVER_SSL_KEY_PATH'
}, ServerInforCF,)