import { Test, TestingModule } from '@nestjs/testing';
import { DatosTecnicosService } from './datos-tecnicos.service';

describe('DatosTecnicosService', () => {
  let service: DatosTecnicosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatosTecnicosService],
    }).compile();

    service = module.get<DatosTecnicosService>(DatosTecnicosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
