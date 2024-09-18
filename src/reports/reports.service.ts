import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDTO } from './dtos/creare-reports';
import { Report } from './report.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDTO: CreateReportDTO) {
    const report = this.repo.create(reportDTO);
    return this.repo.save(report);
  }
}
