import { IsInt, IsString, IsIn } from 'class-validator';

export class CreateParkirDto {
  @IsString()
  platNomor: string;

  @IsIn(['roda2', 'roda4'])
  jenisKendaraan: 'roda2' | 'roda4';

  @IsInt()
  durasi: number;
}
