// movie.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { RoleName } from 'src/user/entities/user.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Role(RoleName.MODERATOR, RoleName.ADMIN, RoleName.USER)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns all companies.',
    type: Company,
    isArray: true,
  })
  findAll(): Observable<Company[]> {
    return this.companyService.findAll();
  }

  @Role(RoleName.MODERATOR, RoleName.ADMIN, RoleName.USER)
  @Get(':id')
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the company with the specified ID.',
    type: Company,
  })
  findOne(@Param('id') id: string): Observable<Company> {
    return this.companyService.findById(id);
  }

  @Role(RoleName.ADMIN)
  @Post()
  @ApiBody({ type: CreateCompanyDto, description: 'New company details' })
  @ApiResponse({
    status: 201,
    description: 'Creates a new company.',
    type: Company,
  })
  create(@Body() createCompanyDto: CreateCompanyDto): Observable<Company> {
    return this.companyService.create(createCompanyDto);
  }

  @Role(RoleName.MODERATOR, RoleName.ADMIN)
  @Put(':id')
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiBody({
    type: UpdateCompanyDto,
    description: 'Updated companyies details',
  })
  @ApiResponse({
    status: 200,
    description: 'Updates the company with the specified ID.',
  })
  update(
    @Param('id') id: string,
    @Body() updateCompnayDto: UpdateCompanyDto,
  ): Observable<UpdateResult> {
    return this.companyService.update(id, updateCompnayDto);
  }

  @Role(RoleName.ADMIN)
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({
    status: 204,
    description: 'Deletes the company with the specified ID.',
  })
  remove(@Param('id') id: string): Observable<DeleteResult> {
    return this.companyService.delete(id);
  }
}
