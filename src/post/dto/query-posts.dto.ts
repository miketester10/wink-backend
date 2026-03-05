import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  Min,
  Max,
  ArrayMaxSize,
  ValidateIf,
} from 'class-validator';

export class QueryPostsDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 40 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(40)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filtra per hashtag (singolo o comma-separated)',
    example: 'tech,nestjs',
  })
  @Transform(({ value }) => {
    if (!value) return undefined;

    let array: unknown[];
    if (typeof value === 'string') {
      array = value.split(',');
    } else if (Array.isArray(value)) {
      array = value;
    } else {
      return undefined;
    }

    const cleaned: string[] = array
      .map((hashtag) =>
        typeof hashtag === 'string' ? hashtag.trim().toLowerCase() : '',
      )
      .filter(Boolean);

    return [...new Set(cleaned)];
  })
  @ValidateIf((_obj, value) => Array.isArray(value))
  @ArrayMaxSize(5, { message: 'Puoi filtrare al massimo 5 hashtag' })
  hashtags?: string[];
}
