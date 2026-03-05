import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { pagination } from 'prisma-extension-pagination';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly client = new PrismaClient().$extends(pagination());

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
