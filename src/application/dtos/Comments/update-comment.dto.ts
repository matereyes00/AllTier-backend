import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The comment the user leaves for the respective tier list.',
    minimum: 1,
    type: String,
    default: 1,
    example: 'This is a comment for tier list [name].',
  })
  commentText: string;
}
