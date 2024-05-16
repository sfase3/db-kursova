import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/database/entities/baseEntity.entity';
import { Car } from 'src/car/entities/car.entity';

export enum RoleName {
  SUDO = 'sudo',
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

@Entity()
export class User extends BaseEntity {
  @ApiProperty({ example: 'john_doe' })
  @Column({ nullable: false })
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  @Column({ unique: true, nullable: false })
  email: string;

  @ApiProperty({ example: 'hashedPassword' })
  @Column({ nullable: false })
  hashedPassword: string;

  @ApiProperty({ example: false })
  @Column({ default: false, nullable: false })
  isBanned: boolean;

  @Column({
    type: 'enum',
    enum: RoleName,
    array: true,
    default: [RoleName.USER, RoleName.ADMIN],
    nullable: false,
  })
  @ApiProperty({
    enum: RoleName,
    isArray: true,
    description: 'User roles.',
  })
  roles: RoleName[];
}
