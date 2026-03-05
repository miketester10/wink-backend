import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [PrismaModule, AuthModule, PostModule],
})
export class AppModule {}
