import { IsString, IsNotEmpty, IsUUID, IsOptional, ValidateIf, IsUrl, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @ApiProperty({
    description: 'The text of the feedback to give in the item.',
    type: String,
    minLength: 10,
    example: 'Feedback text',
  })
  feedback: string;
}
