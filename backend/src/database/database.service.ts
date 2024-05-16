import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  DeleteResult,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Observable, defer } from 'rxjs';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseEntity } from './entities/baseEntity.entity';

@Injectable()
export abstract class DatabaseService<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  findAll(): Observable<T[]> {
    return defer(() => this.repository.find());
  }

  findById(id: string): Observable<T> {
    const options: FindOneOptions<T> = {
      where: { id: id } as FindOptionsWhere<T>,
    };
    return defer(() => this.repository.findOne(options));
  }
  create(entity: DeepPartial<T>): Observable<T> {
    return defer(() => this.repository.save(entity));
  }

  findByIds(ids: string[]): Observable<T[]> {
    const options: FindOptionsWhere<T> = { id: In(ids) } as FindOptionsWhere<T>;
    return defer(() => this.repository.findBy(options));
  }

  update(
    id: string,
    entity: QueryDeepPartialEntity<T>,
  ): Observable<UpdateResult> {
    return defer(() => this.repository.update(id, entity));
  }

  delete(id: string): Observable<DeleteResult> {
    return defer(() => this.repository.delete(id));
  }
}
