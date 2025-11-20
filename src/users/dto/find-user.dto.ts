import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
// import { UserRole } from "@prisma/client";
import { Type } from "class-transformer";

export class FindUserDto {
    @IsOptional()
    @IsString()
    search: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit: number;

    @IsOptional()
    @IsEnum(['roda2', ['roda4']])
    role: 'roda2' | 'roda4'

    // @IsOptional()
    // @IsEnum(UserRole)
    // role: UserRole;
}