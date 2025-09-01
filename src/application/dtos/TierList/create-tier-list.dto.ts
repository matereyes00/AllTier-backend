import { Type } from 'class-transformer';
import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreateItemDto } from '../Items/create-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTierListDto {
  @IsString()
  @ApiProperty({
    type: String,
    description:
      'The tier list name is the title of the tier list the user will own.',
    example: 'Tier List Name',
  })
  tierListName: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'The tier list type can only be rating or tournament',
    enum: ['tournament', 'rating'],
    example: 'tournament',
  })
  tierListType: string;

  @ApiProperty({
    type: String,
    description:
      'The tier list thumbnail to be created. The tier list thumbnail can only be image paths',
    example: 'tournament',
  })
  thumbnailUrl: string;   

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  @IsOptional()
  @ApiProperty({
    type: [String],
    description: 'This is the list of items a tier list has upon creation.',
    example:
      '[{"itemName":"Item Name 1"}, {"itemName": "Item Name 2"}, {"itemName": "Item Name 3"}]',
  })
  items?: CreateItemDto[];
}
