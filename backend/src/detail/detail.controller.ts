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
import { DetailService } from './detail.service';
import { Detail } from './entities/detail.entity';
import { CreateDetailDto, UpdateDetailDto } from './dto/detail.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/auth/role.decorator';
import { RoleName } from 'src/user/entities/user.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@ApiTags('details')
@Controller('details')
export class DetailController {
  constructor(private readonly detailService: DetailService) {}

  @Role(RoleName.MODERATOR, RoleName.ADMIN, RoleName.USER)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns all details.',
    type: Detail,
    isArray: true,
  })
  findAll(): Observable<Detail[]> {
    return this.detailService.findAll();
  }

  @Role(RoleName.MODERATOR, RoleName.ADMIN, RoleName.USER)
  @Get(':id')
  @ApiParam({ name: 'id', description: 'Detail ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the detail with the specified ID.',
    type: Detail,
  })
  findOne(@Param('id') id: string): Observable<Detail> {
    return this.detailService.findById(id);
  }

  @Role(RoleName.ADMIN)
  @Post()
  @ApiBody({ type: CreateDetailDto, description: 'New details' })
  @ApiResponse({
    status: 201,
    description: 'Creates a new detail.',
    type: Detail,
  })
  create(@Body() createDetailDto: CreateDetailDto): Observable<Detail> {
    return this.detailService.create(createDetailDto);
  }

  @Role(RoleName.MODERATOR, RoleName.ADMIN)
  @Put(':id')
  @ApiParam({ name: 'id', description: 'Detail ID' })
  @ApiBody({
    type: UpdateDetailDto,
    description: 'Updated details',
  })
  @ApiResponse({
    status: 200,
    description: 'Updates the detail with the specified ID.',
  })
  update(
    @Param('id') id: string,
    @Body() updateDetailDto: UpdateDetailDto,
  ): Observable<UpdateResult> {
    return this.detailService.update(id, updateDetailDto);
  }

  @Role(RoleName.ADMIN)
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Detail ID' })
  @ApiResponse({
    status: 204,
    description: 'Deletes the detail with the specified ID.',
  })
  remove(@Param('id') id: string): Observable<DeleteResult> {
    return this.detailService.delete(id);
  }
}
