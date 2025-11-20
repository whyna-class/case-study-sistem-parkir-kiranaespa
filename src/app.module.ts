import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { SiswaModule } from './siswa/siswa.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
// import { MenuModule } from './menu/menu.module';
// import { TransactionModule } from './transaction/transaction.module';
// import { CloudinaryService } from './cloudinary/cloudinary.service';
// import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ParkingService } from './parking/parking.service';
import { ParkingController } from './parking/parking.controller';
import { ParkirModule } from './parking/parking.module';

@Module({
  imports: [PrismaModule, ParkirModule, AuthModule, UsersModule],
  // imports: [SiswaModule, PrismaModule, UsersModule, AuthModule, BcryptModule, MenuModule, TransactionModule, CloudinaryModule, ParkingModule],
  controllers: [AppController, ParkingController],
  providers: [AppService, ParkingService], //CloudinaryService
})
export class AppModule {}
