import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateTierListDto {
  @IsString()
  tierListName: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  items?: string[];
}