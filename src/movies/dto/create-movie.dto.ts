import { IsNumber, IsString, IsUUID } from 'class-validator';
import { Gender } from 'src/genders/entities/gender.entity';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  year: number;

  @IsString()
  image: string;

  @IsUUID()
  gender: Gender;
}
