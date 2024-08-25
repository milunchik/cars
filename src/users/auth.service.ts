import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class Authservice {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length > 0) {
      throw new Error('Email already exist!');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const hashPassword = salt + '.' + hash.toString('hex');
    const newUser = await this.usersService.create(email, hashPassword);
    return newUser;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const [salt, storedHash] = user.password.split('.');

    const hashPassword = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hashPassword.toString('hex')) {
      throw new Error('Invalid password ');
    }

    return user;
  }
}
