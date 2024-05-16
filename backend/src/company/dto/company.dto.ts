// create-director.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ description: 'The name of the company.' })
  @IsString()
  @IsNotEmpty()
  fullname: string;
}

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiProperty({ description: 'The name of the company.' })
  fullname: string;
}
