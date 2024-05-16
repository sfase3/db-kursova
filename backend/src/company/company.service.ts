import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseService } from 'src/database/database.service';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService extends DatabaseService<Company> {
  constructor(
    @InjectRepository(Company)
    protected readonly repository: Repository<Company>,
  ) {
    super(repository);
  }
}
