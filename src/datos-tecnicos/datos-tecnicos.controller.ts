import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { DatosTecnicosService } from './datos-tecnicos.service';
import { CreateDatosTecnicosDto } from '../dto/create-datos-tecnicos.dto';
import { UpdateDatosTecnicosDto } from '../dto/update-datos-tecnicos.dto';
import { DatosTecnicos } from '../entities/datos-tecnicos.entity';

@ApiTags('datos-tecnicos')
@Controller('datos-tecnicos')
export class DatosTecnicosController {
  constructor(private readonly datosTecnicosService: DatosTecnicosService) {}

  @ApiOperation({ summary: 'Obtener todos los datos técnicos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los datos técnicos.',
  })
  @Get()
  findAll() {
    return this.datosTecnicosService.findAll();
  }

  @ApiOperation({ summary: 'Obtener datos técnicos por ID de trámite' })
  @ApiResponse({
    status: 200,
    description: 'Datos técnicos encontrados por ID de trámite.',
  })
  @Get('tramite/:tramiteId')
  findByTramiteId(@Param('tramiteId') tramiteId: number) {
    return this.datosTecnicosService.findByTramiteId(tramiteId);
  }

  @ApiOperation({ summary: 'Crear un nuevo dato técnico' })
  @ApiBody({ type: CreateDatosTecnicosDto })
  @ApiResponse({ status: 201, description: 'El dato técnico ha sido creado.' })
  @Post()
  create(@Body() createDatosTecnicosDto: CreateDatosTecnicosDto) {
    const datosTecnicos = new DatosTecnicos();
    datosTecnicos.procedure_id = createDatosTecnicosDto.procedure_id;
    datosTecnicos.date = createDatosTecnicosDto.date;
    datosTecnicos.description = createDatosTecnicosDto.description;
    return this.datosTecnicosService.create(datosTecnicos);
  }

  @ApiOperation({ summary: 'Actualizar un dato técnico por ID' })
  @ApiBody({ type: UpdateDatosTecnicosDto })
  @ApiResponse({
    status: 200,
    description: 'El dato técnico ha sido actualizado.',
  })
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateDatosTecnicosDto: UpdateDatosTecnicosDto,
  ) {
    const datosTecnicos = new DatosTecnicos();
    datosTecnicos.id = id;
    datosTecnicos.procedure_id = updateDatosTecnicosDto.procedure_id;
    datosTecnicos.date = updateDatosTecnicosDto.date;
    datosTecnicos.description = updateDatosTecnicosDto.description;
    return this.datosTecnicosService.update(id, datosTecnicos);
  }

  @ApiOperation({ summary: 'Eliminar un dato técnico por ID' })
  @ApiResponse({
    status: 200,
    description: 'El dato técnico ha sido eliminado.',
  })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.datosTecnicosService.remove(id);
  }
}
