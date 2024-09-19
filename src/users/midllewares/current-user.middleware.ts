import { Injectable, NestMiddleware, Request, Response } from '@nestjs/common';
import { NextFunction } from 'express';
import { UsersService } from '../users.service';

interface Session {
  userId?: string;
}

interface CustomRequest extends Request {
  currentUser?: any;
  session?: any;
}

interface CustomResponse extends Response {}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: CustomRequest, res: CustomResponse, next: NextFunction) {
    const { userId } = req.session || {};

    try {
      if (userId) {
        const user = await this.usersService.findOne(userId);
        req.currentUser = user || null;
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }

    next();
  }
}
