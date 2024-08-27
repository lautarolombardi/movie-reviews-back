import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
  }

  async signIn(email: string, pass: string): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOneWithCredentials(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role.description,
    };
    return {
      ...payload,
      accessToken: await this.signToken(payload),
    };
  }

  async validateUser(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });

    const user = await this.usersService.findOneOrNull(payload.id);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      id: user.id,
      name: user.name,
      role: user.role.description,
      avatar: user.avatar,
    };
  }

  async googleLogin(req) {
    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
