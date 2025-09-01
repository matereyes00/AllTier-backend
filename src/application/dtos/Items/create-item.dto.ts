import { IsString, IsNotEmpty } from 'class-validator';
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
}
