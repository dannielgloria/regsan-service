import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  ConflictException,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { DatosTecnicosService } from './datos-tecnicos.service';
import { CreateDatosTecnicosDto } from '../dto/create-datos-tecnicos.dto';
import { UpdateDatosTecnicosDto } from '../dto/update-datos-tecnicos.dto';
import { DatosTecnicos } from '../entities/datos-tecnicos.entity';
import { Response } from 'express';

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
  async create(
    @Body() createDatosTecnicosDto: CreateDatosTecnicosDto,
    @Res() res: Response,
  ) {
    try {
      const datosTecnicos = new DatosTecnicos();
      datosTecnicos.procedure_id = createDatosTecnicosDto.procedure_id;
      datosTecnicos.date = createDatosTecnicosDto.date;
      datosTecnicos.description = createDatosTecnicosDto.description;
      await this.datosTecnicosService.create(datosTecnicos);
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'El dato tecnico ha sido creado.',
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: error.message,
        });
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Actualizar un dato técnico por ID' })
  @ApiBody({ type: UpdateDatosTecnicosDto })
  @ApiResponse({
    status: 200,
    description: 'El dato técnico ha sido actualizado.',
  })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDatosTecnicosDto: UpdateDatosTecnicosDto,
    @Res() res: Response,
  ) {
    try {
      const datosTecnicos = new DatosTecnicos();
      datosTecnicos.id = id;
      datosTecnicos.procedure_id = updateDatosTecnicosDto.procedure_id;
      datosTecnicos.date = updateDatosTecnicosDto.date;
      datosTecnicos.description = updateDatosTecnicosDto.description;
      await this.datosTecnicosService.update(id, datosTecnicos);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Los datos tecnicos han sido modificados exitosamente.',
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
        });
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Eliminar un dato técnico por ID' })
  @ApiResponse({
    status: 200,
    description: 'El dato técnico ha sido eliminado.',
  })
  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    try {
      await this.datosTecnicosService.remove(id);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'El dato tecnico ha sido eliminado.',
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
        });
      }
      throw error;
    }
  }
}
