import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsObject, IsPositive } from 'class-validator';

export class Pagination {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @ApiProperty()
  pageNumber: number;

  @IsNotEmpty()
  @IsIn([5, 25, 50, 75, 100])
  @ApiProperty()
  pageSize: number;

  @IsNotEmpty()
  @ApiProperty({ default: { by: 'createdAt', direction: 'asc' } })
  @IsObject()
  sort: {
    by: string;
    direction: 'asc' | 'desc';
  };
}
