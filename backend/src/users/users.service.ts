/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from './user.schema';
import { ConfigService } from '@nestjs/config'; //  JWT_SECRET
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, // Explicitly typed as Model<UserDocument>
    private configService: ConfigService,
  ) {}

  async register(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; message?: string }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const userExists = await this.userModel.findOne({
        $or: [{ username: userData.username }, { email: userData.email }],
      });
      if (userExists) {
        return { success: false, message: 'Username or email already exists' };
      }
      // hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = new this.userModel({
        ...userData,
        password: hashedPassword,
      });
      await newUser.save();
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Server error' };
    }
  }

  async login(loginData: { email: string; password: string }): Promise<{
    success: boolean;
    message?: string;
    token?: string;
    user?: any;
  }> {

    const { email, password } = loginData;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: 'Incorrect password' };
    }
    // generate token
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
      username: user.username,
    };
    const secret = this.configService.get<string>('JWT_SECRET') || 'default_secret';
    const token: string = jwt.sign(payload, secret, { expiresIn: '7d' }) as string;
    // return user info
    const userObj = user.toObject();
    delete (userObj as { password?: string }).password;
    return { success: true, token, user: userObj };
  }
}
