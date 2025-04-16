import { PartialType } from '@nestjs/swagger';

import { DeleteAreasDto } from './delete-areas.dto';

export class RestoreAreasDto extends PartialType(DeleteAreasDto) {}
