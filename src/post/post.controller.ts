import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto, QueryPostsDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators';
import type { JwtPayload } from '../auth/decorators';
import { ParseObjectIdPipe } from 'src/common/pipes';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postsService: PostService) {}

  @Get()
  @ApiOperation({
    summary: 'Lista post pubblici (blog) - paginata, filtro hashtags',
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({
    name: 'hashtags',
    required: false,
    description: 'hashtag singolo o comma-separated',
  })
  @ApiResponse({
    status: 200,
    description:
      'Risposta paginata: result, totalCount, totalPages, currentPage, hasNextPage, hasPrevPage',
  })
  findAll(@Query() query: QueryPostsDto) {
    return this.postsService.findAllPublic(query);
  }

  @Get('my-posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Tutti i post dell’utente autenticato (draft + published), per gestirli/eliminarli',
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findMyPosts(@CurrentUser() user: JwtPayload, @Query() query: QueryPostsDto) {
    return this.postsService.findMyPosts(user.sub, query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Crea post (CMS) - protetto JWT, sempre draft, author Brian Fox, authorId da JWT',
  })
  create(@Body() dto: CreatePostDto, @CurrentUser() user: JwtPayload) {
    return this.postsService.create(dto, user.sub);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pubblica un post (CMS) - protetto JWT' })
  publish(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.postsService.publish(id, user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Elimina un post (CMS) - protetto JWT' })
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.postsService.remove(id, user.sub);
  }
}
