//users.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-useres.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserRole } from 'src/shared/enums/UserRole.enum';
import { User, UserDocument } from 'src/shared/schema/users';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) {
      throw new BadRequestException('email already exist');
    }
    const createdUser = new this.userModel<Partial<User>>({
      email: createUserDto.email,
      password: createUserDto.password,
      username: createUserDto.username,
      role: createUserDto.role,
    });
    const savedUser = await createdUser.save();
    return savedUser.toObject({ virtuals: false });
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findAllAndCount(request: GetUsersDto,) {
    try {
      const { pageNumber, pageSize, sort, filters } = request;

      if (!pageNumber || !pageSize) {
        throw new Error('Pagination parameters are required');
      }      


      // Build the query
      const query: any = {};

      
      if (filters?.fromdate || filters?.todate) {
        query.createdAt = {};
        if (filters.fromdate) {
          query.createdAt.$gte = new Date(filters.fromdate);
        }
        if (filters.todate) {
          query.createdAt.$lte = new Date(filters.todate);
        }
      }

      if (filters?.username) {
        query['username'] = { $regex: filters.username, $options: 'i' }; 
      }
      if (filters?.email) {
        query['email'] = { $regex: filters.email, $options: 'i' }; 
      }
      if (filters?.role) {
        query['role'] = filters.role;
      }

      // Fetch the data and count
      const data = await this.userModel
        .find(query)
        .limit(pageSize)
        .skip(pageSize * (pageNumber - 1))
        .sort({ createdAt: -1 })
        .exec();

      const count = await this.userModel.countDocuments(query).exec();

      return { data, count };
    } catch (error) {
      throw new BadRequestException('Error while fetching users: ' + error.message);
    }
  }



  async findOne(id: string) {
    return await this.userModel.findById(id).exec();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data = {
      email: updateUserDto.email,
      password: updateUserDto.password,
      role: updateUserDto.role,
      username: updateUserDto.username,
    };

    return await this.userModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async find(filter: any): Promise<UserDocument[]> {
    return this.userModel.find(filter).exec();
  }
  
  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}
