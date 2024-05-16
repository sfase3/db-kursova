import { Entity, Column, ManyToMany, JoinTable, Check } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/database/entities/baseEntity.entity';
import { Car } from 'src/car/entities/car.entity';

@Entity()
export class Detail extends BaseEntity {
  @Column()
  @ApiProperty({ description: 'The name of the detail.' })
  fullname: string;

  @Column({ default: true })
  @ApiProperty({
    description: 'Flag indicating if the detail is serviceable.',
  })
  serviceable: boolean;

  @Check('"price" >= 0')
  @Column({ type: 'int', nullable: false })
  @ApiProperty({ description: 'The price of the car in USD.' })
  price: number;

  @ManyToMany(() => Car, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({
    name: 'car_detail',
    joinColumn: { name: 'detail_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'car_id', referencedColumnName: 'id' },
  })
  @ApiProperty({ description: 'The cars in which the detail is compatible.' })
  cars: Car[];
}
