import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateItemDto {
  @IsUUID()
  @IsOptional()
  itemId?: string; // Include ID for existing items, omit for new ones

  @IsString()
  itemName: string;
}
