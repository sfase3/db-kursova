import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { DatabaseService } from 'src/database/database.service';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';
import { CarService } from 'src/car/car.service';
@Injectable()
export class UserService extends DatabaseService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    protected readonly carService: CarService,
  ) {
    super(repository);
  }
  getUserByEmail(email: string): Observable<User> {
    return from(this.repository.findOne({ where: { email } }));
  }
}
