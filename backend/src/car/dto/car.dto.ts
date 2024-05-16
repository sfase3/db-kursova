import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';

export enum CarCondition {
  USED = 'used',
  NEW = 'new',
}

export class CreateCarDto {
  @ApiProperty({
    description: 'The make of the car.',
    example: 'Toyota',
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    description: 'The model of the car.',
    example: 'Camry',
  })
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty({
    description: 'The year the car was manufactured.',
    example: 2020,
  })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;

  @ApiProperty({
    description: 'The mileage of the car in kilometers.',
    example: 50000,
  })
  @IsInt()
  @Min(0)
  mileage: number;

  @ApiProperty({
    description: 'The condition of the car (new or used).',
    example: CarCondition.USED,
  })
  @IsNotEmpty()
  @IsEnum(CarCondition)
  condition: CarCondition;

  @ApiProperty({
    description: 'Whether the car is available for sale.',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isavailable: boolean;

  @ApiProperty({
    description: 'The price of the car in USD.',
    example: 25000,
  })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'The VIN (Vehicle Identification Number) of the car.',
    example: '1HGCM82633A',
  })
  @IsNotEmpty()
  @IsString()
  vin: string;

  @ApiProperty({
    description: 'The description of the car.',
    example: 'Well-maintained sedan with low mileage.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AddCompanyDto {
  @ApiProperty({ description: 'ID of the company', type: String })
  @IsString()
  readonly companyId: string | null;
}

export class AddDetailsDto {
  @ApiProperty({ description: 'IDs of the details', type: [String] })
  @IsArray()
  @IsString({ each: true })
  readonly detailsIds: string[] | null;
}

export class UpdateCarDto extends PartialType(CreateCarDto) {}
