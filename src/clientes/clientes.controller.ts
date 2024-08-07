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
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';

@ApiTags('clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de todos los clientes.' })
  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  @ApiOperation({ summary: 'Buscar clientes por nombre' })
  @ApiResponse({ status: 200, description: 'Clientes encontrados por nombre.' })
  @Get('search')
  findByName(@Query('nombre') nombre: string) {
    return this.clientesService.findByName(nombre);
  }

  @ApiOperation({
    summary: 'Obtener RFC y nombre comercial de todos los clientes',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de RFC y nombre comercial de todos los clientes.',
  })
  @Get('combo')
  findRFCAndBusinessName() {
    return this.clientesService.findRFCAndBusinessName();
  }

  @ApiOperation({ summary: 'Obtener un cliente por RFC' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado por RFC.' })
  @Get(':rfc')
  findOne(@Param('rfc') rfc: string) {
    return this.clientesService.findOne(rfc);
  }

  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiBody({ type: CreateClienteDto })
  @ApiResponse({ status: 201, description: 'El cliente ha sido creado.' })
  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @ApiOperation({ summary: 'Actualizar un cliente por RFC' })
  @ApiBody({ type: UpdateClienteDto })
  @ApiResponse({ status: 200, description: 'El cliente ha sido actualizado.' })
  @Put(':rfc')
  update(
    @Param('rfc') rfc: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clientesService.update(rfc, updateClienteDto);
  }

  @ApiOperation({ summary: 'Eliminar un cliente por RFC' })
  @ApiResponse({ status: 200, description: 'El cliente ha sido eliminado.' })
  @Delete(':rfc')
  remove(@Param('rfc') rfc: string) {
    return this.clientesService.remove(rfc);
  }
}
