import { IsString, IsNotEmpty, IsOptional, MinLength, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {

  @IsNumber()
  @Min(1)
  @Max(10)
  @IsNotEmpty()
  score: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @IsOptional()
  @ApiProperty({
    description: 'The text of the feedback to give in the item.',
    type: String,
    minLength: 10,
    example: 'Feedback text',
  })
  feedback: string;
}
