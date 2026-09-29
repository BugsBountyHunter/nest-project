import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { Report } from './entity/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from '../users/user.entity';

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(async () => {
    const fakeRepository = {
      create: (dto: CreateReportDto) => ({ ...dto }) as unknown as Report,
      save: (report: Report) => Promise.resolve({ id: 1, ...report }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: getRepositoryToken(Report), useValue: fakeRepository },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create saves the report and attaches the current user', async () => {
    const user = { id: 7, email: 'asdf@asdf.com' } as User;
    const dto: CreateReportDto = {
      make: 'toyota',
      model: 'corolla',
      year: 2015,
      mileage: 100000,
      lng: 0,
      lat: 0,
      price: 12000,
    };

    const report = await service.create(dto, user);

    expect(report.id).toEqual(1);
    expect(report.make).toEqual('toyota');
    expect(report.user).toBe(user);
  });
});
