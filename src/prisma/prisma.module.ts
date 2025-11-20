import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
// import { ParkirService } from 'src/parking/parking.service';
// import { ParkingController } from 'src/parking/parking.controller';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}