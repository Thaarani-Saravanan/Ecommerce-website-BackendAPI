//product.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { Product, ProductDocument } from 'src/shared/schema/product';
import { UserRole } from 'src/shared/enums/UserRole.enum';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/shared/schema/users';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private userService: UsersService,
  ) {}

  
  async create(createProductDto: CreateProductDto, user: User) {

    const seller = await this.userService.findOne(user._id);
    if (!seller) {
        throw new BadRequestException('Seller not found');
      }
    
      if (![UserRole.ADMIN, UserRole.STAFF, UserRole.VENDOR].includes(seller.role)) {
        throw new BadRequestException('You do not have permission to create a product');
      }


      if (seller.role === UserRole.STAFF && !createProductDto.vendorId) {
        throw new BadRequestException('Staff must specify a vendor ID');
      }


           
    
    const expiryDate = new Date(createProductDto.startDate);
    expiryDate.setDate(expiryDate.getDate() + 7);

   
    const existingProduct = await this.productModel.findOne({
      productUrl: createProductDto.productUrl,
    });
    if (existingProduct) {
      throw new BadRequestException('Product URL must be unique');
    }


    if (createProductDto.vendorId) {
        const vendor = await this.userService.findOne(createProductDto.vendorId);
        if (!vendor || vendor.role !== UserRole.VENDOR) {
          throw new BadRequestException('Invalid vendor ID');
        }
      }


   
    const product = new this.productModel({
      ...createProductDto,
      
      userId: user._id, 
      expiryDate,
    });

    await product.save();
    return product;
  }

   async findAll(user: User) {
    if (user.role === UserRole.ADMIN) {
      return this.productModel.find().exec();  
    } else if (user.role === UserRole.STAFF) {
      
      return this.productModel.find({ userId: user._id }).exec();
    } else if (user.role === UserRole.VENDOR) {
      
      return this.productModel.find({ userId: user._id }).exec();
    }
    return [];  
  }

  
  async findBySeller(sellerId: string, user: User) {
    if (user.role === UserRole.ADMIN || user.role === UserRole.STAFF) {
      return this.productModel.find({ userId: sellerId }).exec();
    } else {
      throw new BadRequestException('Unauthorized');
    }
  }
}