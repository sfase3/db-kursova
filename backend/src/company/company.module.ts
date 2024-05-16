import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Company } from './entities/company.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { forwardRef } from '@nestjs/common';
@Module({
  controllers: [CompanyController],
  exports: [CompanyService],
  providers: [CompanyService],
  imports: [TypeOrmModule.forFeature([Company]), forwardRef(() => AuthModule)],
})
export class CompanyModule {}
