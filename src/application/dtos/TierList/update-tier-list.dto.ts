import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateItemDto } from '../Items/update-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTierListDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'The tier list name to be updated.',
  })
  tierListName?: string;

  @ApiProperty({
    type: String,
    description:
      'The tier list type to be updated. The tier list type can only be rating or tournament',
    enum: ['tournament', 'rating'],
    example: 'tournament',
  })
  tierListType: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateItemDto)
  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'These are the list of items of a tier list to be updated.',
  })
  items?: UpdateItemDto[];
}
