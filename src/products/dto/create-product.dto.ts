//create-product.dto
import { IsString, IsNumber, IsDate, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsDate()
  startDate: Date;

  @IsNumber()
  oldPrice: number;

  @IsNumber()
  newPrice: number;

  @IsString()
  productUrl: string;

  @IsBoolean()
  freeDelivery: boolean;

  @IsNumber()
  deliveryAmount: number;

  @IsArray()
  images: string[];

  @IsOptional()
  @IsString()
  vendorId: string; 

}
