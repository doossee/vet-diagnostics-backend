import { PartialType } from '@nestjs/swagger';
import { CreateVetStationDto } from './create-vet-station.dto';

export class UpdateVetStationDto extends PartialType(CreateVetStationDto) {}
