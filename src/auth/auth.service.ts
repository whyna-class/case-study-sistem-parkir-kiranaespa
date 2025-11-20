import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcrypt: BcryptService,
    private readonly jwt: JwtService
  ) { }
  async auth(authDto: AuthDto) {
    const { email, password } = authDto;
    try {
      const { email, password } = authDto
      const findUser = await this.prisma.user.findFirst({
        where: { email }
      })
      if (!findUser) {
        return {
          succes: false,
          message: `invalid email`,
          data: null
        }
      }

      const IsMatchPassword = await this.bcrypt.comparePassword(password, findUser.password)
      if (!IsMatchPassword) {
        return {
          success: false,
          message: `invalid password`,
          data: null
        };
      }
      const token = this.jwt.sign(
        {
          id: findUser.id, name: findUser.name, role: findUser.role
        }
      )
      return {
        success: true,
        message: `login successful`,
        data: { token, name: findUser.name, role: findUser.role }
      }
    } catch (error) {
      return {
        success: false,
        message: `error when signin: ${error.message}`,
        data: null
      }
    }
  }
}

