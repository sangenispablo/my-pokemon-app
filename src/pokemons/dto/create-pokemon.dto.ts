import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePokemonDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  @Min(0)
  hp?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sprites?: string[];
}
