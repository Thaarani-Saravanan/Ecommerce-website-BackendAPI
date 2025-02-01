import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Pagination } from 'src/shared/dtos/pagination.dto';
import { UserRole } from 'src/shared/enums/UserRole.enum';
import { Type } from 'class-transformer';

export class GetAllUserDtoFilters {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  fromdate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  todate?: string;

}
  export class GetUsersDto extends Pagination {
    @ApiProperty({ type: GetAllUserDtoFilters })
    @Type(() =>  GetAllUserDtoFilters )
    @ValidateNested()
    filters:  GetAllUserDtoFilters ;
}
