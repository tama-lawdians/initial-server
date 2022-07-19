import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/models/enum.model';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
