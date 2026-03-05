import { PostStatus as PrismaPostStatus } from '@prisma/client';

/** Enum per lo status del post: draft | published. Allineato allo schema Prisma. */
export const PostStatus = PrismaPostStatus;
