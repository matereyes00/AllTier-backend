import { IsString, IsNotEmpty } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  itemName: string;
}
