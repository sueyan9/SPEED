import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(userData: any): Promise<{ success: boolean; message?: string }> {
    try {
      const userExists = await this.userModel.findOne({ $or: [{ username: userData.username }, { email: userData.email }] });
      if (userExists) {
        return { success: false, message: 'Username or email already exists' };
      }
      const newUser = new this.userModel(userData);
      await newUser.save();
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Server error' };
    }
  }
}