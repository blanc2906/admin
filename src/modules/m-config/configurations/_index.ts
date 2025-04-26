import { AuthCF, authConfigurations } from './auth.cf';
import { SampleCF, sampleConfigurations } from './sample.cf';
import { ServerInforCF, serverInforConfigurations } from './server-infor.cf';

export type RuleInstance =
  | InstanceType<typeof SampleCF>
  | InstanceType<typeof ServerInforCF>
  | InstanceType<typeof AuthCF>;
export const configurations = [
  //sampleConfigurations,
  //serverInforConfigurations,
  authConfigurations,
];
