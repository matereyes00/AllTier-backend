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
}
