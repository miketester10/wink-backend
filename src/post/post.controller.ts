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
  Patch,
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
      'Lista post dell’utente autenticato (draft + published) - paginata, filtro hashtags',
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
    description: "Lista paginata dei post dell'utente",
  })
  @ApiResponse({ status: 401, description: 'Non autorizzato' })
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
  @ApiResponse({
    status: 201,
    description: 'Post creato con successo in stato draft',
  })
  @ApiResponse({ status: 401, description: 'Non autorizzato' })
  create(@Body() dto: CreatePostDto, @CurrentUser() user: JwtPayload) {
    return this.postsService.create(dto, user.sub);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pubblica un post (CMS) - protetto JWT' })
  @ApiResponse({ status: 200, description: 'Post pubblicato con successo' })
  @ApiResponse({ status: 401, description: 'Non autorizzato' })
  @ApiResponse({
    status: 403,
    description: 'Non puoi pubblicare un post di un altro utente',
  })
  @ApiResponse({ status: 404, description: 'Post non trovato' })
  @ApiResponse({ status: 409, description: 'Il post è già stato pubblicato' })
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
  @ApiResponse({ status: 204, description: 'Post eliminato con successo' })
  @ApiResponse({ status: 401, description: 'Non autorizzato' })
  @ApiResponse({
    status: 403,
    description: 'Non puoi eliminare un post di un altro utente',
  })
  @ApiResponse({ status: 404, description: 'Post non trovato' })
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.postsService.remove(id, user.sub);
  }
}
