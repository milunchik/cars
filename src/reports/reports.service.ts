import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDTO } from './dtos/creare-reports';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDTO: CreateReportDTO, user: User) {
    const report = this.repo.create(reportDTO);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({
      where: { id: parseInt(id) },
      relations: ['user'],
    });

    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;
    console.log('Updated report:', report);

    const approvedReport = await this.repo.save(report);

    return approvedReport;
  }
}
