import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateItemDto {
  @IsString()
  @ApiProperty({
    type: String,
    example: 'Item 1',
    description: 'This is the name of the item to be updated.',
  })
  itemName: string;
}
