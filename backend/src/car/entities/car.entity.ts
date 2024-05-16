import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Check,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/database/entities/baseEntity.entity';
import { User } from 'src/user/entities/user.entity';
import { CarCondition } from '../dto/car.dto';
import { Company } from 'src/company/entities/company.entity';
import { Detail } from 'src/detail/entities/detail.entity';

@Entity()
export class Car extends BaseEntity {
  @ManyToOne(() => Company, (company) => company.cars, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  @ApiProperty({
    description: 'The company of the car.',
    name: 'companyid',
    example: '112a2371-7421-4a78-8059-615b61ed2dc6',
  })
  company: Company;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'The country of the car.' })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'The model of the car.' })
  model: string;

  @Column({ type: 'int', nullable: false })
  @ApiProperty({ description: 'The year the car was manufactured.' })
  year: number;

  @Check('"mileage" >= 0')
  @Column({ type: 'int', nullable: false })
  @ApiProperty({ description: 'The mileage of the car in kilometers.' })
  mileage: number;

  @Column({ type: 'enum', enum: CarCondition, default: CarCondition.USED })
  @ApiProperty({ description: 'The condition of the car (new or used).' })
  condition: CarCondition;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Whether the car is available for sale.' })
  isavailable: boolean;

  @Check('"price" >= 0')
  @Column({ type: 'int', nullable: false })
  @ApiProperty({ description: 'The price of the car in USD.' })
  price: number;

  @Column({ type: 'varchar', length: 17, nullable: false, unique: true })
  @ApiProperty({
    description: 'The VIN (Vehicle Identification Number) of the car.',
  })
  vin: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'The description of the car.' })
  description: string;

  @ManyToMany(() => Detail, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({
    name: 'car_detail',
    joinColumn: { name: 'car_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'detail_id', referencedColumnName: 'id' },
  })
  details: Detail[];
}
