import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { DatabaseService } from 'src/database/database.service';
import { Observable, defer, from, map, switchMap } from 'rxjs';
import { Car } from './entities/car.entity';
import { CarCondition, CreateCarDto } from './dto/car.dto';
import { CompanyService } from 'src/company/company.service';
import { DetailService } from 'src/detail/detail.service';
import { Company } from 'src/company/entities/company.entity';
import { Detail } from 'src/detail/entities/detail.entity';
import { companies, details } from './mock';
import { User } from 'src/user/entities/user.entity';

type FilteredCarsResponse = {
  cars: Car[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
};

@Injectable()
export class CarService extends DatabaseService<Car> {
  async mockUp(): Promise<void> {
    try {
      const insertedCompanies = await this.companyRepository.save(companies);

      const insertedDetails = await this.detailRepository.save(details);

      const carsToInsert = this.generateCars(20).map((car) => ({
        ...car,
        company:
          insertedCompanies[
            Math.floor(Math.random() * insertedCompanies.length)
          ],
        details: [
          insertedDetails[Math.floor(Math.random() * insertedDetails.length)],
        ],
      }));

      await this.carRepository.save(carsToInsert);

      console.log('Data successfully inserted into the database.');
    } catch (error) {
      console.error('Error inserting data into the database:', error);
    }
  }
  constructor(
    @InjectRepository(Car)
    protected readonly carRepository: Repository<Car>,
    @InjectRepository(Detail)
    private readonly detailRepository: Repository<Detail>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly companyService: CompanyService,
    private readonly detailService: DetailService,
  ) {
    super(carRepository);
  }

  filter(
    page: number,
    limit: number,
    conditions: CarCondition[],
    mileage: number,
  ): Observable<FilteredCarsResponse> {
    const queryBuilder = this.repository.createQueryBuilder('car');

    if (conditions && conditions.length > 0) {
      const conditionValues = conditions.map((condition) =>
        condition.valueOf(),
      );
      queryBuilder.andWhere('car.condition = ANY(:conditions)', {
        conditions: conditionValues,
      });
    }

    if (mileage) {
      queryBuilder.andWhere('car.mileage >= :mileage', { mileage });
    }

    queryBuilder.leftJoinAndSelect('car.details', 'details');
    queryBuilder.leftJoinAndSelect('car.company', 'company');

    return from(
      queryBuilder
        .take(limit)
        .skip((page - 1) * limit)
        .getManyAndCount(),
    ).pipe(
      map(([cars, totalCount]) => {
        const totalPages = Math.ceil(totalCount / limit);
        return {
          cars,
          currentPage: page,
          totalPages,
          totalCount,
        };
      }),
    );
  }

  addCompanyToCar(carId: string, companyId: string | null): Observable<Car> {
    return this.findById(carId).pipe(
      switchMap((car) => {
        if (!car) {
          throw new NotFoundException('Car not found');
        }
        if (!companyId) {
          car.company = null;
          return this.repository.save(car);
        }
        return this.companyService.findById(companyId).pipe(
          switchMap((company) => {
            if (!company) {
              throw new NotFoundException('Company not found');
            }
            car.company = company;
            return this.repository.save(car);
          }),
        );
      }),
    );
  }

  addDetailsToCar(carId: string, detailsIds: string[]): Observable<Car> {
    return this.findById(carId).pipe(
      switchMap((car) => {
        if (!car) {
          throw new NotFoundException('Car not found');
        }
        if (!detailsIds) {
          car.details = null;
          return this.repository.save(car);
        }
        return this.detailService.findByIds(detailsIds).pipe(
          switchMap((details) => {
            if (details.length !== detailsIds.length) {
              throw new NotFoundException('One or more details not found');
            }
            car.details = details;
            return this.repository.save(car);
          }),
        );
      }),
    );
  }

  generateCars(count: number): CreateCarDto[] {
    const cars: CreateCarDto[] = [];
    const countries = [
      'Japan',
      'USA',
      'Germany',
      'South Korea',
      'Italy',
      'France',
    ];
    const models = [
      'Corolla',
      'Civic',
      'Accord',
      'Camry',
      'A4',
      '3 Series',
      'C-Class',
      'Optima',
      'Fusion',
      'Cruze',
    ];
    const conditions = [CarCondition.USED, CarCondition.NEW];
    const descriptions = [
      'Compact sedan',
      'SUV',
      'Luxury sedan',
      'Hatchback',
      'Pickup truck',
    ];

    for (let i = 0; i < count; i++) {
      const randomCountry =
        countries[Math.floor(Math.random() * countries.length)];
      const randomModel = models[Math.floor(Math.random() * models.length)];
      const randomYear = Math.floor(Math.random() * (2022 - 2000 + 1)) + 2000; // Random year between 2000 and 2022
      const randomMileage =
        Math.floor(Math.random() * (80000 - 10000 + 1)) + 10000; // Random mileage between 10000 and 80000
      const randomCondition =
        conditions[Math.floor(Math.random() * conditions.length)];
      const randomAvailability = Math.random() < 0.8; // 80% chance of being available
      const randomPrice = Math.floor(Math.random() * (40000 - 8000 + 1)) + 8000; // Random price between 8000 and 40000
      const randomVin = `VIN${Math.floor(Math.random() * 10000)}`; // Random VIN number
      const randomDescription =
        descriptions[Math.floor(Math.random() * descriptions.length)];

      const newCar: CreateCarDto = {
        country: randomCountry,
        model: randomModel,
        year: randomYear,
        mileage: randomMileage,
        condition: randomCondition,
        isavailable: randomAvailability,
        price: randomPrice,
        vin: randomVin,
        description: randomDescription,
      };

      cars.push(newCar);
    }

    return cars;
  }

  findByIdWithRelations(id: string): Observable<Car> {
    const options: FindOneOptions<Car> = {
      where: { id: id } as FindOptionsWhere<Car>,
      relations: ['company', 'details'],
    };
    return defer(() => this.repository.findOne(options));
  }
}
