// product.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { Product, ProductSchema } from 'src/shared/schema/product';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema }]),
      UsersModule,
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports : [ProductsService]
})
export class ProductsModule {}
