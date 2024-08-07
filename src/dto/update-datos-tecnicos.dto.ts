import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDatosTecnicosDto } from './create-datos-tecnicos.dto';

export class UpdateDatosTecnicosDto extends PartialType(
  CreateDatosTecnicosDto,
) {
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
