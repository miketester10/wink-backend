import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, MinLength, ArrayMinSize } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  body: string;

  @ApiProperty({ type: [String], example: ['tech', 'nestjs'] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  hashtags: string[];
}
