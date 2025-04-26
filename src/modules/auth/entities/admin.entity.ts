import { AdminRole } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class AdminEntity {
  id: number;
  email: string;

  @Exclude()
  password: string;

  role: AdminRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<AdminEntity>) {
    Object.assign(this, partial);
  }
}
