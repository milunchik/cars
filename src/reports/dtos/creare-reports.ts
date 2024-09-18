import {
  IsLatitude,
  IsLatLong,
  IsNumber,
  IsString,
  Min,
  Max,
} from 'class-validator';

export class CreateReportDTO {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  year: number;

  @IsNumber()
  @Min(1)
  @Max(1000000)
  mileage: number;

  @IsString()
  lng: string;

  @IsString()
  lat: string;

  @IsNumber()
  @Min(1)
  @Max(100000)
  price: number;
}
