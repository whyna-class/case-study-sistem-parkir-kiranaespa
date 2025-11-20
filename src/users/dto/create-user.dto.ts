import {IsEmail, IsNotEmpty, IsString, IsStrongPassword} from "class-validator";
// import { UserRole } from "@prisma/client";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @IsNotEmpty()
    @IsString()
    jenisKendaraan: string;


    // @IsNotEmpty()
    // @IsString()
    // role: UserRole;

}
