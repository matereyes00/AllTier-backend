import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdateTierListDto {
  @IsString()
  @IsOptional()
  tierListName?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  items?: string[];
}
