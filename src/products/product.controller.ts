//product.controller.ts
import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AllowRoles } from 'src/shared/decorators/allowRoles.decorator';
import { UserRole } from 'src/shared/enums/UserRole.enum';
import { CurrentUser } from 'src/shared/decorators/current-user.decorators';
import { ProductsService } from './product.service';


@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/create')
  @ApiOperation({ description: 'Create a new product.' })
  @AllowRoles(UserRole.ADMIN, UserRole.STAFF, UserRole.VENDOR)
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user
  ) {
    return this.productsService.create(createProductDto, user);
  }
  

  @Get()
  @ApiOperation({ description: 'Get all products.' })
  @AllowRoles(UserRole.ADMIN, UserRole.STAFF, UserRole.VENDOR)
  async findAll(@CurrentUser() user) {
    return this.productsService.findAll(user);
  }

  @Get('/vendor/:id')
  @ApiOperation({ description: 'Get products by vendor.' })
  @AllowRoles(UserRole.ADMIN, UserRole.STAFF, UserRole.VENDOR)
  async findBySeller(@Param('id') sellerId: string, @CurrentUser() user) {
    return this.productsService.findBySeller(sellerId, user);
  }
}
