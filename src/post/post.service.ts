import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Post } from '@prisma/client';
import { PostStatus } from './constants/post-status.const';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResponse } from '../common/interfaces';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublic(query: QueryPostsDto): Promise<PaginatedResponse<Post>> {
    const { page = 1, limit = 10, hashtags } = query;
    const hashtagList = hashtags
      ? hashtags
          .split(',')
          .map((h) => h.trim())
          .filter(Boolean)
      : undefined;

    const where = {
      status: PostStatus.published,
      ...(hashtagList?.length ? { hashtags: { hasSome: hashtagList } } : {}),
    };

    const [posts, meta] = await this.prisma.client.post
      .paginate({ where })
      .withPages({
        limit,
        page,
        includePageCount: true,
      });

    return this.mapToPaginatedResponse(
      posts,
      meta.totalCount ?? 0,
      meta.pageCount ?? 0,
      meta.currentPage,
    );
  }

  async findMyPosts(
    userId: string,
    query: QueryPostsDto,
  ): Promise<PaginatedResponse<Post>> {
    const { page = 1, limit = 10 } = query;

    const where = { authorId: userId };

    const [posts, meta] = await this.prisma.client.post
      .paginate({ where })
      .withPages({
        limit,
        page,
        includePageCount: true,
      });

    return this.mapToPaginatedResponse(
      posts,
      meta.totalCount ?? 0,
      meta.pageCount ?? 0,
      meta.currentPage,
    );
  }

  async create(dto: CreatePostDto, userId: string): Promise<Post> {
    return this.prisma.client.post.create({
      data: {
        title: dto.title,
        body: dto.body,
        hashtags: dto.hashtags ?? [],
        authorId: userId,
      },
    });
  }

  async publish(id: string, userId: string): Promise<Post> {
    const post = await this.prisma.client.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post non trovato');
    if (post.authorId !== userId) {
      throw new ForbiddenException(
        'Non puoi pubblicare un post di un altro utente',
      );
    }
    return this.prisma.client.post.update({
      where: { id },
      data: { status: PostStatus.published },
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.prisma.client.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post non trovato');
    if (post.authorId !== userId) {
      throw new ForbiddenException(
        'Non puoi eliminare un post di un altro utente',
      );
    }
    await this.prisma.client.post.delete({ where: { id } });
  }

  private mapToPaginatedResponse<T>(
    items: T[],
    totalCount: number,
    totalPages: number,
    currentPage: number,
  ): PaginatedResponse<T> {
    return {
      result: items,
      totalCount,
      totalPages,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }
}
