import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.client.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email già registrata');
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.client.user.create({
      data: {
        email: dto.email,
        password: hashed,
      },
    });
    return {
      user: { id: user.id, email: user.email, createdAt: user.createdAt },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.client.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenziali non valide');
    }
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    return {
      access_token: token,
    };
  }
}
