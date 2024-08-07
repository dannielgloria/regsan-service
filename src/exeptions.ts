import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundEmployeException extends HttpException {
  constructor() {
    super('Empleado no encontrado', HttpStatus.NOT_FOUND);
  }
}

export class ConflictEmployeException extends HttpException {
  constructor() {
    super('Empleado ya existe', HttpStatus.CONFLICT);
  }
}
