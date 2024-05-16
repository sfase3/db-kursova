import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateDetailDto {
  @ApiProperty({ description: 'The name of the detail.' })
  fullname: string;

  @ApiProperty({ description: 'The cars in which the detail is compatible.' })
  serviceable: boolean;

  @ApiProperty({ description: 'Price.' })
  price: number;
}

export class UpdateDetailDto extends PartialType(CreateDetailDto) {}
