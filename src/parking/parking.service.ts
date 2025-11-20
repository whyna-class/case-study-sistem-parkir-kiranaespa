import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateParkirDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { jenisKendaraan, Parkir } from '@prisma/client';

@Injectable()
export class ParkingService {
  getTotalPendapatan() {
    throw new Error('Method not implemented.');
  }
 async update(id: number, dto: UpdateParkingDto) {
    try {
      const existing = await this.prisma.parkir.findFirst({ where: { id } });

      if (!existing) {
        return {
          success: false,
          message: 'Datanya ga ada woy',
          data: null,
        };
      }

      let total: number;
      if (dto.durasi) {
        total = this.calculateTotal(dto.jenisKendaraan ?? existing.jenisKendaraan, dto.durasi);
      } else {
        total = existing.total;
      }

      const updated = await this.prisma.parkir.update({
        where: { id },
        data: {
          platNomor: dto.platNomor ?? existing.platNomor,
          jenisKendaraan: dto.jenisKendaraan ?? existing.jenisKendaraan,
          durasi: dto.durasi ?? existing.durasi,
          total,
        },
      });

      return {
        success: true,
        message: 'Parkir updated',
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }
  hitungTotal(arg0: string, durasi: number) {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService) { }

  // 1. FUNGSI LOGIKA PERHITUNGAN TOTAL
   private calculateTotal(jenis: string, durasi: number): number {
    if (!jenis) throw new BadRequestException('Jenis kendaraan harus diisi.');
    if (durasi == null || isNaN(durasi) || durasi < 1)
      throw new BadRequestException('Durasi harus >= 1');

    jenis = jenis.toUpperCase();

    const TARIF_R2_PERTAMA = 3000;
    const TARIF_R2_BERIKUTNYA = 2000;
    const TARIF_R4_PERTAMA = 6000;
    const TARIF_R4_BERIKUTNYA = 4000;

    let total = 0;
    let tarifPertama: number;
    let tarifBerikutnya: number;

    if (jenis === 'RODA2') {
      tarifPertama = TARIF_R2_PERTAMA;
      tarifBerikutnya = TARIF_R2_BERIKUTNYA;
    } else if (jenis === 'RODA4') {
      tarifPertama = TARIF_R4_PERTAMA;
      tarifBerikutnya = TARIF_R4_BERIKUTNYA;
    } else {
       throw new BadRequestException('Jenis kendaraan tidak valid.');
    }

    total = tarifPertama + (durasi > 1 ? (durasi - 1) * tarifBerikutnya : 0);
    return total;
  }

      // Harus durasi minimal 1 (sudah divalidasi oleh DTO)

  // src/parking/parking.service.ts
  // 2. FITUR POST /parkir (CREATE)
   async create(createParkingDto: CreateParkirDto): Promise<Parkir> {
    const { jenisKendaraan, durasi, platNomor } = createParkingDto;
    const total = this.calculateTotal(jenisKendaraan, durasi);

    const newParking = await this.prisma.parkir.create({
      data: {
        platNomor,
        jenisKendaraan: jenisKendaraan as jenisKendaraan,
        durasi,
        total,
      },
    });

    return newParking;
  }

  // 3. FITUR GET /parkir (FIND ALL)
  async findAll(): Promise<Parkir[]> {
    return this.prisma.parkir.findMany();
  }

  // 4. FITUR GET /parkir/:id (FIND ONE)
  async findOne(id: number): Promise<Parkir> {
    const data = await this.prisma.parkir.findUnique({
      where: { id }
    });
    if (!data) {
      throw new BadRequestException(`data parkir dengan ID ${id} tidak ditemukan.`);
    }
    return data;
  }

  async getTotal() {
  try {
    const result = await this.prisma.parkir.aggregate({
      _sum: {
        total: true,
        durasi: true,
      },
      _count: {
        id: true,
      },
    });
    return {
      totalPendapatan: result._sum.total ?? 0,
      totalDurasi: result._sum.durasi ?? 0
    };
  } catch (error) {
    console.error("ERROR SAAT GET TOTAL:", error);
    throw error;
  }
}
async getTotalRevenue(): Promise<number> {
    const parkings = await this.prisma.parkir.findMany();
    return parkings.reduce((sum, p) => sum + p.total, 0);
  }


  // 7. FITUR DELETE /parkir/:id (HAPUS DATA)
async remove(id: number): Promise<{ message: string }> {
  // Pastikan data ada sebelum dihapus
  await this.findOne(id);

  await this.prisma.parkir.delete({
    where: { id },
  });

  return { message: `Data parkir dengan ID ${id} berhasil dihapus.` };
}
}