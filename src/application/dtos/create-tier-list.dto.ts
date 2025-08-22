import { Type } from 'class-transformer';
import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreateItemDto } from './create-item.dto';

export class CreateTierListDto {
  @IsString()
  tierListName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  @IsOptional()
  items?: CreateItemDto[];
}