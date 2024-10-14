import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { ClientesModule } from './clientes/clientes.module';
import { TramitesModule } from './tramites/tramites.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { Cliente } from './entities/cliente.entity';
import { Tramite } from './entities/tramite.entity';
import { Empleado } from './entities/empleado.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'srv1065.hstgr.io',
      port: parseInt('3306', 10) || 3306,
      username: 'u917498081_regsan_admin',
      password: '>b&nwW@~7Rn',
      database: 'u917498081_regsan',
      autoLoadEntities: true,
      synchronize: true, // Desactiva esto en producción
    }),
    TypeOrmModule.forFeature([Cliente, Tramite, Empleado]),
    PassportModule,
    JwtModule.register({
      secret: 'w6RsrijEkQhpueSUKV+cuW7WJrAzlFDAMnzbFHJ2n4k=',
      signOptions: { expiresIn: '60m' },
    }),
    AuthModule,
    ClientesModule,
    TramitesModule,
    EmpleadosModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
