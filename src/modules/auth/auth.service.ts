import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    // find out if an existing user is attached to the given email
    const user = await this.userService.findOneByEmail(email);

    if (!user) throw 'No user found';

    // check if the passwords match
    const match = await this.comparePassword(pass, user.password);
    if (!match) return null;

    const { password, ...result } = user;
    return result;
  }

  public async login(user: { email: string; password: string }): Promise<{
    user: {
      id: string;
      email: string;
      name: string;
    };
    token: string;
  }> {
    const userData = await this.validateUser(user.email, user.password);

    const token = await this.generateToken(userData);
    return { user: userData, token };
  }

  public async create(user: UserDto): Promise<{
    user: {
      id: string;
      email: string;
      name: string;
    };
    token: string;
  }> {
    // hash the password
    const pass = await this.hashPassword(user.password);

    // create the user
    const { password, ...data } = await this.userService.create({
      ...user,
      password: pass,
    });
    const token = await this.generateToken(data);

    // return the user and the token
    return { user: data, token: token };
  }

  private async generateToken(user: {
    id: string;
    email: string;
    name: string;
  }): Promise<string> {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async comparePassword(enteredPassword: string, dbPassword: string) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }
}
