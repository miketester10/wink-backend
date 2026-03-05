import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty()
  @IsString({ message: 'Il titolo deve essere una stringa' })
  @MinLength(1, { message: 'Il titolo non può essere vuoto' })
  @MaxLength(120, { message: 'Il titolo non può superare i 120 caratteri' })
  title: string;

  @ApiProperty()
  @IsString({ message: 'Il contenuto deve essere una stringa' })
  @MinLength(1, { message: 'Il contenuto non può essere vuoto' })
  @MaxLength(10000, {
    message: 'Il contenuto non può superare i 10000 caratteri',
  })
  body: string;

  @ApiProperty({ type: [String], example: ['tech', 'nestjs'] })
  @IsArray({ message: 'Gli hashtag devono essere un array' })
  @ArrayMinSize(1, { message: 'Devi inserire almeno un hashtag' })
  @ArrayMaxSize(5, { message: 'Puoi inserire al massimo 5 hashtag' })
  @Transform(({ value }) => {
    if (!Array.isArray(value)) return [];

    const cleaned = value
      .map((v: string) => v.trim().toLowerCase())
      .filter(Boolean);

    return [...new Set(cleaned)];
  })
  hashtags: string[];
}
