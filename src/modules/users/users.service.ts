import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(user: UserDto): Promise<User> {
    return this.userRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }
  async findOneById(id: string): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }
}
