import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Detail } from './entities/detail.entity';
import { DetailController } from './detail.controller';
import { DetailService } from './detail.service';
import { forwardRef } from '@nestjs/common';

@Module({
  controllers: [DetailController],
  providers: [DetailService],
  imports: [TypeOrmModule.forFeature([Detail]), forwardRef(() => AuthModule)],
  exports: [DetailService],
})
export class DetailModule {}
