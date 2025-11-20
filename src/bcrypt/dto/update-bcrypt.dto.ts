import { PartialType } from '@nestjs/mapped-types';
import { CreateBcryptDto } from './create-bcrypt.dto';

export class UpdateBcryptDto extends PartialType(CreateBcryptDto) {}
