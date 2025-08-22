import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateItemDto } from './update-item.dto';

export class UpdateTierListDto {
  @IsString()
  @IsOptional()
  tierListName?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateItemDto)
  @IsOptional()
  items?: UpdateItemDto[];
}
