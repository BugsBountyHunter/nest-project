import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReportsService } from '@App/reports/reports.service';
import { CreateReportDto } from '@App/reports/dto/create-report.dto';
import { AuthGuard } from '@App/guards/auth.guard';
import { CurrentUser } from '@App/users/decorators/current-user.decorator';
import { User } from '@App/users/user.entity';
import { Serialize } from '@App/interceptors/serialize.interceptor';
import { ReportDto } from '@App/reports/dto/report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }
}
