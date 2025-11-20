// src/parkir/parkir.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe, Delete, Patch, Query } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { CreateParkirDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';

@Controller('parkir')
export class ParkingController {
  constructor(private readonly parkirService: ParkingService) {}

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.parkirService.remove(id);
  }

  @Post()
  // create(@Body() dto: CreateParkirDto) {
    create(@Body() body: any)
    {console.log('body masuk:', body);
    return this.parkirService.create(body);
  }

  @Get('total')
  findAll() {
    return this.parkirService.getTotal();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.parkirService.findOne(Number(id));
  }

  @Get('total-revenue')
  async getTotalRevenue() {
    const total = await this.parkirService.getTotalRevenue();
    return { success: true, data: { total } };
  }

  @Get()
  findAllParkir() {
    return this.parkirService.findAll();
  } 

@Patch(':id')
  update(@Param('id', ParseIntPipe) id: number,@Body() updateParkirDto: UpdateParkingDto,) {
    return this.parkirService.update(id, updateParkirDto);
}

}
