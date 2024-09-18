import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDTO } from './dtos/creare-reports';
import { AuthGuard } from 'src/guards/auth.guards';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ReportDTO } from './dtos/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApprovedReportDTO } from './dtos/approve-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}
  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDTO)
  createReport(@Body() body: CreateReportDTO, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch(':id')
@Serialize(ReportDTO)
approveReport(@Param('id') id: string, @Body() body: ApprovedReportDTO) {
  return this.reportsService.changeApproval(id, body.approved);
}

}
