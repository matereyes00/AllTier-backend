import { IsString, IsNotEmpty, IsUUID, IsOptional, ValidateIf, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The title or name of the item to include in the Tier List.',
    minimum: 1,
    type: String,
    default: 1,
    example: 'Item 2',
  })
  itemName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The category of the item to include in the Tier List.',
    type: String,
    example: 'Category 1',
  })
  category: string;

  @IsOptional()
  @ValidateIf(o => o.itemPhotoUrl !== null) // This ensures @IsUrl is only applied if the value is not null
  @IsUrl() 
  @ApiProperty({
    description: 'The URL of the photo for this item, uploaded to Cloudinary.',
    required: false,
    nullable: true, 
    example: 'http://res.cloudinary.com/demo/image/upload/v123/item.jpg',
  })
  itemPhotoUrl?: string | null;
}
