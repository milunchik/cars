import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  const users: User[] = [];
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) => {
        const filterUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filterUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;

        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService, //ask for this
          useValue: fakeUsersService, //give them this
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instanse of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('kdemwk@gmail.com', 'kdjfj');
    expect(user.password).not.toEqual('kdjfj');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('error during the sign in user with unused email', async () => {
    await expect(service.signin('kdjfsj@gmail.com', 'kfdfk')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws an error when user tries to sign in with invalid password', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await expect(service.signin('rkgmvkldfn', 'kvjnv')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('checking password comparising', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    await expect(service.signin('kvmkdfmvd', 'dkvdkv')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided ', async () => {
    await service.signup('ksdvksdnvk@gmail.com', 'mypassword');
    const user = await expect(
      service.signin('ksdvksdnvk@gmail.com', 'mypassword'),
    ).resolves.toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await expect(
      service.signup('ksdvksdnvk@gmail.com', 'password'),
    ).rejects.toThrow(BadRequestException);
  });
  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('jkdnvkdnvdk@gmail.com', 'password'),
    ).rejects.toThrow(NotFoundException);
  });
  it('throws if an invalid password is provided(in signin)', async () => {
    await service.signup('kdnvnskvn@gmail.com', 'mypassword');
    await expect(
      service.signin('kdnvnskvn@gmail.com', 'password'),
    ).rejects.toThrow(BadRequestException);
  });
});
