import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let users: User[];

  beforeEach(async () => {
    users = [{ id: 1, email: 'asdf@asdf.com', password: 'hash' } as User];

    const fakeRepository = {
      create: (attrs: Partial<User>) => ({ ...attrs }) as User,
      save: (user: User) => Promise.resolve(user),
      remove: (user: User) => Promise.resolve(user),
      findOneBy: ({ id }: { id: number }) =>
        Promise.resolve(users.find((user) => user.id === id) ?? null),
      find: ({ where }: { where: { email: string } }) =>
        Promise.resolve(users.filter((user) => user.email === where.email)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: fakeRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne returns null when no id is given', () => {
    expect(service.findOne(null)).toBeNull();
  });

  it('find returns users matching the email', async () => {
    const found = await service.find('asdf@asdf.com');
    expect(found).toHaveLength(1);
  });

  it('update applies the given attributes', async () => {
    const updated = await service.update(1, { email: 'new@asdf.com' });
    expect(updated.email).toEqual('new@asdf.com');
  });

  it('update throws if the user does not exist', async () => {
    await expect(service.update(99, { email: 'x@x.com' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('remove throws if the user does not exist', async () => {
    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
  });
});
