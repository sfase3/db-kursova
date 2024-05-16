import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CompanyModule } from 'src/company/company.module';
import { DetailModule } from 'src/detail/detail.module';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { Car } from './entities/car.entity';
import { forwardRef } from '@nestjs/common';
import { Detail } from 'src/detail/entities/detail.entity';
import { Company } from 'src/company/entities/company.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  controllers: [CarController],
  providers: [CarService],
  imports: [
    forwardRef(() => AuthModule),
    DetailModule,
    CompanyModule,
    TypeOrmModule.forFeature([Car, Detail, Company, User]),
  ],
  exports: [CarService],
})
export class CarModule {}
