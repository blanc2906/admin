import { SampleService } from "@auth/services/sample.service";
import { BaseController } from "@base/controllers/p-base.controller";
import { Controller, Inject, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
@ApiTags('Sample')
@Controller('sample')
export class SampleController extends BaseController<SampleService> {
  constructor(readonly sampleService: SampleService) {
    super(sampleService);
  }
}