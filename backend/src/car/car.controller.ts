import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/auth/role.decorator';
import { RoleName } from 'src/user/entities/user.entity';
import { CarService } from './car.service';
import { Car } from './entities/car.entity';
import {
  AddDetailsDto,
  CarCondition,
  CreateCarDto,
  UpdateCarDto,
} from './dto/car.dto';

@ApiTags('cars')
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  convertToArray<T>(value: T | T[]): T[] {
    if (!value) {
      return undefined;
    }
    if (!Array.isArray(value)) {
      return [value] as T[];
    }
    return value;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleName.MODERATOR, RoleName.ADMIN, RoleName.USER)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns all cars.',
    type: Car,
    isArray: true,
  })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiQuery({
    name: 'condition',
    required: false,
    type: String,
    isArray: true,
    example: [CarCondition.NEW, CarCondition.USED],
  })
  @ApiQuery({
    name: 'mileage',
    required: false,
    type: Number,
    description: 'minimum mileage',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('condition') condition: CarCondition[],
    @Query('mileage') mileage: number,
  ) {
    const conditionVal = this.convertToArray(condition);
    return this.carService.filter(page, limit, conditionVal, mileage);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleName.MODERATOR, RoleName.ADMIN, RoleName.USER)
  @Get(':id')
  @ApiParam({ name: 'id', description: 'Car ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the car with the specified ID.',
    type: Car,
  })
  findOne(@Param('id') id: string): Observable<Car> {
    return this.carService.findByIdWithRelations(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleName.ADMIN)
  @Post()
  @ApiBody({ type: CreateCarDto, description: 'New car details' })
  @ApiResponse({
    status: 201,
    description: 'Creates a new car.',
    type: Car,
  })
  create(@Body() createCarDto: CreateCarDto): Observable<Car> {
    return this.carService.create(createCarDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleName.MODERATOR, RoleName.ADMIN)
  @Put(':id')
  @ApiParam({ name: 'id', description: 'Car ID' })
  @ApiBody({ type: UpdateCarDto, description: 'Updated car details' })
  @ApiResponse({
    status: 200,
    description: 'Updates the car with the specified ID.',
  })
  update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
  ): Observable<UpdateResult> {
    return this.carService.update(id, updateCarDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleName.ADMIN)
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Car ID' })
  @ApiResponse({
    status: 204,
    description: 'Deletes the movie with the specified ID.',
  })
  remove(@Param('id') id: string): Observable<DeleteResult> {
    return this.carService.delete(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleName.MODERATOR, RoleName.ADMIN)
  @Post(':carId/details')
  @ApiResponse({
    status: 200,
    description: 'Adds the specified details to the movie.',
  })
  @ApiBody({
    description: 'Array of detail IDs to be added to the car.',
    type: AddDetailsDto,
  })
  addDetailsToCar(
    @Param('carId') carId: string,
    @Body('detailsIds') detailsIds: string[],
  ): Observable<Car> {
    return this.carService.addDetailsToCar(carId, detailsIds);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleName.MODERATOR, RoleName.ADMIN)
  @Post(':carId/:companyId')
  @ApiParam({ name: 'companyId', description: 'Company ID' })
  @ApiResponse({
    status: 200,
    description: 'Adds the specified company to the car.',
  })
  addCompanyToCar(
    @Param('carId') carId: string,
    @Param('companyId') companyId: string,
  ): Observable<Car> {
    return this.carService.addCompanyToCar(carId, companyId);
  }
  @Post('/mockUp')
  mockUp(): Promise<void> {
    return this.carService.mockUp();
  }
}
