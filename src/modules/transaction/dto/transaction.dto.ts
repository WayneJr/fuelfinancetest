import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class TransactionDto {
  @IsString()
  @IsNotEmpty()
  sum: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;
}
