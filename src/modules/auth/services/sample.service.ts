import { PBaseService } from "@base/services/p-base.service";
import { Injectable, Inject } from "@nestjs/common";
import { PrismaService } from "@prisma/services/prisma.service";
import { Configuration } from "@prisma/client";

@Injectable()
export class SampleService extends PBaseService<Configuration> {
  constructor(
    protected prisma: PrismaService,
  ) {
    super(prisma.configuration);

  }
}