import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entity/report.entity';
import { User } from '../users/user.entity';

describe('ReportsController', () => {
  let controller: ReportsController;
  let fakeReportsService: Partial<ReportsService>;

  beforeEach(async () => {
    fakeReportsService = {
      create: jest.fn((dto: CreateReportDto, user: User) =>
        Promise.resolve({ id: 1, ...dto, user } as unknown as Report),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [{ provide: ReportsService, useValue: fakeReportsService }],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createReport delegates to the service with the current user', async () => {
    const user = { id: 7 } as User;
    const dto = { make: 'toyota', model: 'corolla' } as CreateReportDto;

    const report = await controller.createReport(dto, user);

    expect(fakeReportsService.create).toHaveBeenCalledWith(dto, user);
    expect(report.id).toEqual(1);
  });
});
