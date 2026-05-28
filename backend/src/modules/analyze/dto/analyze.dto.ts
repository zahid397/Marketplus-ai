import { IsString, IsNotEmpty, MaxLength } from 'class-validator'
import { Transform } from 'class-transformer'

export class AnalyzeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @Transform(({ value }) => String(value).toUpperCase().trim())
  ticker: string
}
