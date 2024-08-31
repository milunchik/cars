import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id) => {
        return Promise.resolve({
          id,
          email: 'aikafjef@rk.com',
          password: 'djfndks',
        } as User);
      },
      find: (email) => {
        return Promise.resolve([{ id: 1, email, password: 'jdfdf' } as User]);
      },
      remove: (id: number) => {
        return Promise.resolve({
          id,
          email: 'jdfbsj@test.com',
          password: 'fjkfdsnds',
        } as User);
      },
      update: (id: number, attrs: Partial<User>) => {
        const user = { id, ...attrs } as User;
        return Promise.resolve(user);
      },
    };
    fakeAuthService = {
      signup: (email: string, password: string) => {
        return Promise.resolve({
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User);
      },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    await fakeAuthService.signup('test@test.com', 'mypassword');
    const users: User[] = await controller.findAllUsers('test@test.com');

    expect(users);
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('sign in updates session object and return user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'cjkdcnk@test.com', password: 'efjekf' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  it('sign out, return null', async () => {
    const session = { userId: 2 };

    await controller.signout(session);

    expect(session.userId).toBeNull();
  });

  it('updates user', async () => {
    const user = await controller.update('1', {
      email: 'newemail@test.com',
      password: 'newpassword',
    });

    expect(user).toBeDefined();
  });

  it('find user by id and delete it', async () => {
    const user = await controller.removeUser('2');

    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('2')).rejects.toThrow(NotFoundException);
  });
});
