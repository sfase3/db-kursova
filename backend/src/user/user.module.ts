import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { CarModule } from 'src/car/car.module';

@Module({
  providers: [UserService],
  imports: [
    forwardRef(() => CarModule),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
