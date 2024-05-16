// director.entity.ts
import { Entity, Column, OneToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/database/entities/baseEntity.entity';
import { Car } from 'src/car/entities/car.entity';

@Entity()
export class Company extends BaseEntity {
  @Column({ unique: true })
  @ApiProperty({ description: 'The name of the company.' })
  fullname: string;

  @OneToMany(() => Car, (car) => car.company)
  @ApiProperty({ description: 'The cars created by the company.' })
  cars: Car[];
}
