import { Expose, Transform } from 'class-transformer';

export class ReportDTO {
  @Expose()
  price: number;
  @Expose()
  year: number;
  @Expose()
  lng: string;
  @Expose()
  lat: string;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  mileage: number;

  @Expose()
  approved: boolean;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
