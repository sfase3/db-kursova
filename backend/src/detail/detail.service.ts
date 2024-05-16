import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Detail } from './entities/detail.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DetailService extends DatabaseService<Detail> {
  constructor(
    @InjectRepository(Detail)
    protected readonly repository: Repository<Detail>,
  ) {
    super(repository);
  }
}
