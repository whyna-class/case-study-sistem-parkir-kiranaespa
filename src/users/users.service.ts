import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { find } from 'rxjs';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {

  constructor
  (private prisma:  PrismaService, private readonly bcrypt : BcryptService) {}
   async create(createUserDto: CreateUserDto) {
    try{
      const { name, email, password, jenisKendaraan} = createUserDto;
      const createUser = await this.prisma.jenisKendaraan.create({
        data: {
          name,
          email,
          password: await this.bcrypt.hashPassword(password), 
          jenisKendaraan
        }
      })
         return {
      success: true,
      message: "user create succesfully",
      data: createUser
      }
    } catch (error) {
      return {
        success: false,
        message: `something went wrong: ${error.message}`,
        data: null
      }
    }
   }

  async findAll(findUserDto: FindUserDto) {
    try {
      const { search = "", role, page = 1, limit = 10, } = findUserDto;
      const skip = (page - 1) * limit;

      const where: any = {};
      //searching by name
      if (search) {
        where.name = {
            contains: search
        };
      }
      //filter by role
      if (role){
        where.role = role;
      }

      const users = await this.prisma.jenisKendaraan.findMany({
        where,
        skip: skip,
        take: Number(limit),
      })
      const total = await this.prisma.user.count({ where });

      return {
        success: true,
        message: "user data found successfully",
        data: users,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total/limit),
        },
      }
    } catch (error) {
      return {
        succes: false,
        message: "error when"
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const { name, email, password, jenisKendaraan } = updateUserDto
      const findUser = await this.prisma.user.findFirst({ where: {id : id}})
      if (!findUser) {
        return {
          success : false,
          message : `user does not exists`,
          data : null
        }
      }
    const updateUser = await this.prisma.user.update({
        where: {id: id},
        data: {
          name: name ?? findUser.name,
          email: email ?? findUser.email,
          password: password ?? findUser.password,
        }
      })
      return {
        success : true,
        message : `new user has updated`,
        data: updateUser
      }
    } catch (error){
      return {
        success: false,
        message : `error when update user: ${error.message}`,
        data: null
      }
    }
    }

  async remove(id: number) {
    try {
      const findUser = await this.prisma.user.findFirst({
        where: {
          id: id
        }
      })
      if (!findUser) {
        return {
          success: false,
          message: `user does not exists`,
          data: null
        }
      }
      const deletedUser = await this.prisma.user.delete({
        where: {
          id: id
        }
      })
      return {
        success: true,
        message: `user has delete`,
        data: deletedUser
      }
    } catch (error) {
      return{
        succes: false,
        message: `error when delete user: ${error.message}`,
        data: null
      }
    }
  }
}
