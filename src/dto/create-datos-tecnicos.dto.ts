import { ApiProperty } from '@nestjs/swagger';

export class CreateDatosTecnicosDto {
  @ApiProperty({ example: 1, description: 'ID del trámite' })
  procedure_id: number;

  @ApiProperty({ example: '2024-01-01', description: 'Fecha del dato técnico' })
  date: Date;

  @ApiProperty({
    example: 'Descripción del dato técnico',
    description: 'Descripción del dato técnico',
  })
  description: string;
}
