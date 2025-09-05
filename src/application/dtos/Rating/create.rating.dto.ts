import { IsString, IsNotEmpty, IsOptional, MinLength, IsNumber, Min, Max, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';


export class CreateRatingDto {

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the item being rated.' })
  itemId: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  @IsNotEmpty()
  @ApiProperty({ description: 'The numerical rating of the item.' })
  score: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @IsOptional()
  @ApiProperty({
    description: 'The text of the feedback to give in the item rating.',
    type: String,
    minLength: 10,
    example: 'Feedback text',
  })
  feedback: string;
}

export class CreateBulkRatingDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRatingDto)
  @ApiProperty({
    type: [CreateRatingDto],
    description: 'An array of ratings to be created for items within a tier list.',
  })
  ratings: CreateRatingDto[];
}