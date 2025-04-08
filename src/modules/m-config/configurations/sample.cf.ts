import { IsString } from "class-validator"
import { ConfigurationRule } from "../dto/common.dto"


export class SampleCF {
    @IsString()
    sampleName: String
}

export const sampleConfigurations= new ConfigurationRule<SampleCF>("sample",{
    sampleName: 'SAMPLE_NAME'
}, SampleCF,)