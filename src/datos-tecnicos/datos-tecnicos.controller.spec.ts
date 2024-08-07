import { Test, TestingModule } from '@nestjs/testing';
import { DatosTecnicosController } from './datos-tecnicos.controller';

describe('DatosTecnicosController', () => {
  let controller: DatosTecnicosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatosTecnicosController],
    }).compile();

    controller = module.get<DatosTecnicosController>(DatosTecnicosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
