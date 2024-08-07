import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { TramitesService } from './tramites.service';
import { CreateTramiteDto } from '../dto/create-tramite.dto';
import { UpdateTramiteDto } from '../dto/update-tramite.dto';
import { Tramite } from '../entities/tramite.entity';

@ApiTags('tramites')
@Controller('tramites')
export class TramitesController {
  constructor(private readonly tramitesService: TramitesService) {}

  @ApiOperation({ summary: 'Obtener todos los trámites' })
  @ApiResponse({ status: 200, description: 'Lista de todos los trámites.' })
  @Get()
  findAll() {
    return this.tramitesService.findAll();
  }

  @ApiOperation({ summary: 'Buscar trámites por nombre comercial del cliente' })
  @ApiResponse({
    status: 200,
    description: 'Trámites encontrados por nombre comercial.',
  })
  @Get('search')
  findByClientBusinessName(@Query('businessName') businessName: string) {
    return this.tramitesService.findByClientBusinessName(businessName);
  }

  @ApiOperation({ summary: 'Buscar trámites por estado' })
  @ApiResponse({ status: 200, description: 'Trámites encontrados por estado.' })
  @Get('status')
  findByStatus(@Query('status') status: string) {
    return this.tramitesService.findByStatus(status);
  }

  @ApiOperation({ summary: 'Obtener un trámite por ID' })
  @ApiResponse({ status: 200, description: 'Trámite encontrado por ID.' })
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.tramitesService.findById(id);
  }

  @ApiOperation({ summary: 'Crear un nuevo trámite' })
  @ApiBody({ type: CreateTramiteDto })
  @ApiResponse({ status: 201, description: 'El trámite ha sido creado.' })
  @Post()
  async create(@Body() createTramiteDto: CreateTramiteDto) {
    const tramite = new Tramite();
    tramite.client_rfc = createTramiteDto.client_rfc;
    tramite.distinctive_denomination =
      createTramiteDto.distinctive_denomination;
    tramite.generic_name = createTramiteDto.generic_name;
    tramite.product_manufacturer = createTramiteDto.product_manufacturer;
    tramite.service_name = createTramiteDto.service_name;
    tramite.input_value = createTramiteDto.input_value;
    tramite.type_description = createTramiteDto.type_description;
    tramite.class_name = createTramiteDto.class_name;
    tramite.start_date = createTramiteDto.start_date;
    tramite.end_date = createTramiteDto.end_date;
    tramite.status = createTramiteDto.status;
    tramite.process_description = createTramiteDto.process_description;
    tramite.completion_percentage = createTramiteDto.completion_percentage;
    tramite.cofepris_entry_date = createTramiteDto.cofepris_entry_date;
    tramite.cofepris_status = createTramiteDto.cofepris_status;
    tramite.cofepris_entry_number = createTramiteDto.cofepris_entry_number;
    tramite.cofepris_link = createTramiteDto.cofepris_link;
    tramite.assigned_consultant = createTramiteDto.assigned_consultant;
    tramite.additional_information = createTramiteDto.additional_information;

    return this.tramitesService.create(tramite);
  }

  @ApiOperation({ summary: 'Actualizar un trámite por ID' })
  @ApiBody({ type: UpdateTramiteDto })
  @ApiResponse({ status: 200, description: 'El trámite ha sido actualizado.' })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTramiteDto: UpdateTramiteDto,
  ) {
    const tramite = new Tramite();
    tramite.id = id;
    tramite.client_rfc = updateTramiteDto.client_rfc;
    tramite.distinctive_denomination =
      updateTramiteDto.distinctive_denomination;
    tramite.generic_name = updateTramiteDto.generic_name;
    tramite.product_manufacturer = updateTramiteDto.product_manufacturer;
    tramite.service_name = updateTramiteDto.service_name;
    tramite.input_value = updateTramiteDto.input_value;
    tramite.type_description = updateTramiteDto.type_description;
    tramite.class_name = updateTramiteDto.class_name;
    tramite.start_date = updateTramiteDto.start_date;
    tramite.end_date = updateTramiteDto.end_date;
    tramite.status = updateTramiteDto.status;
    tramite.process_description = updateTramiteDto.process_description;
    tramite.completion_percentage = updateTramiteDto.completion_percentage;
    tramite.cofepris_entry_date = updateTramiteDto.cofepris_entry_date;
    tramite.cofepris_status = updateTramiteDto.cofepris_status;
    tramite.cofepris_entry_number = updateTramiteDto.cofepris_entry_number;
    tramite.cofepris_link = updateTramiteDto.cofepris_link;
    tramite.assigned_consultant = updateTramiteDto.assigned_consultant;
    tramite.additional_information = updateTramiteDto.additional_information;

    return this.tramitesService.update(id, tramite);
  }

  @ApiOperation({ summary: 'Eliminar un trámite por ID' })
  @ApiResponse({ status: 200, description: 'El trámite ha sido eliminado.' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tramitesService.remove(id);
  }
}
