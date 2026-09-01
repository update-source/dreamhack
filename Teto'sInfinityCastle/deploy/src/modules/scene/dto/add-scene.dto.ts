import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class AddSceneDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(44)
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(6, { each: true })
  @IsNotEmpty()
  scenes: number[];
}
