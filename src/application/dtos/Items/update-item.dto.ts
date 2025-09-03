import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateItemDto {
  @IsString()
  @ApiProperty({
    type: String,
    example: 'Item 1',
    description: 'This is the name of the item to be updated.',
  })
  itemName: string;

  @IsString()
  @ApiProperty({
    description: 'The category of the item to edit in the Tier List.',
    type: String,
    example: 'Category 2',
  })
  category: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({
    description: "The item's new photo URL from Cloudinary.",
    required: false,
    example: 'https://res.cloudinary.com/demo/image/upload/new-image.jpg',
  })
  itemPhotoUrl?: string; 
}
