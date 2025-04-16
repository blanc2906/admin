import { PartialType } from '@nestjs/swagger';

import { DeleteEstatesDto } from './deleteEstates.dto';

export class RestoreEstatesDto extends PartialType(DeleteEstatesDto) {}
