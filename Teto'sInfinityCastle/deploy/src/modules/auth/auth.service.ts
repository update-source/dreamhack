import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { flatten } from 'flatnest';
import { createHash } from 'crypto';
import { ROLES } from 'src/common/constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    try {
      if (username.length < 8 || username.length > 20) {
        throw new Error('Username must be between 8 and 20 characters');
      }
      const hashed_pass = createHash('sha256').update(password).digest('hex');
      const user = await this.userModel.distinct('password', {
        username,
      });
      const user_password = user[0];
      if (!user_password) {
        await this.userModel.create({
          username,
          password: hashed_pass,
          role: ROLES.USER,
        });
      }
      if (user.length && user_password !== hashed_pass) {
        throw new Error('Invalid password');
      }
      const body: object = flatten({
        username,
        hashed_pass,
        role: ROLES.USER,
      }) as object;
      return { access_token: await this.jwtService.signAsync(body) };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllUser() {
    try {
      const users = await this.userModel.find();
      return users;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async addUser(username: string, password: string) {
    try {
      if (username.length < 8 || username.length > 20) {
        throw new Error('Username must be between 8 and 20 characters');
      }
      const hashed_pass = createHash('sha256').update(password).digest('hex');
      const newUser = await this.userModel.create({
        username,
        password: hashed_pass,
        role: ROLES.USER,
      });
      return newUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
