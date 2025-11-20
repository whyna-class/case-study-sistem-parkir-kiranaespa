// src/parking/dto/update-parking.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateParkirDto } from './create-parking.dto'; 
import { IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateParkingDto extends PartialType(CreateParkirDto) {
    @IsOptional()
    @Type(() => Number) 
    @IsInt({ message: 'Durasi harus berupa angka jam (bilangan bulat).' })
    @Min(1, { message: 'Durasi parkir minimal 1 jam.' })
    durasi?: number;
}