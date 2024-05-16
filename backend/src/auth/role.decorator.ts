import { SetMetadata } from '@nestjs/common';
import { RoleName } from 'src/user/entities/user.entity';

export const Role = (...roles: RoleName[]) => {
  return SetMetadata('role', roles);
};
