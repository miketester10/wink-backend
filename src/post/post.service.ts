import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
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

    const where: Prisma.PostWhereInput = {
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
      meta.totalCount,
      meta.pageCount,
      meta.isFirstPage,
      meta.isLastPage,
      meta.currentPage,
      meta.nextPage,
      meta.previousPage,
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
      meta.totalCount,
      meta.pageCount,
      meta.isFirstPage,
      meta.isLastPage,
      meta.currentPage,
      meta.nextPage,
      meta.previousPage,
    );
  }

  async create(dto: CreatePostDto, userId: string): Promise<Post> {
    return this.prisma.client.post.create({
      data: {
        title: dto.title,
        body: dto.body,
        hashtags: dto.hashtags ?? [], // fare controllo con filter booelan per scartare hashtag vuoti
        authorId: userId,
      },
    });
  }

  async publish(id: string, userId: string): Promise<Post> {
    const post = await this.prisma.client.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post non trovato');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException(
        'Non puoi pubblicare un post di un altro utente',
      );
    }

    if (post.status === 'published') {
      throw new ConflictException('Il post è già stato pubblicato');
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
    isFirstPage: boolean,
    isLastPage: boolean,
    currentPage: number,
    nextPage: number | null,
    prevPage: number | null,
  ): PaginatedResponse<T> {
    return {
      result: items,
      totalCount,
      totalPages,
      isFirstPage,
      isLastPage,
      currentPage,
      nextPage,
      prevPage,
    };
  }
}
