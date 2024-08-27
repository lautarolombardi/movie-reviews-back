import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `https://https://movie-reviews-back.onrender.com/auth/google-redirect`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName, emails, photos } = profile;
    const email = emails[0].value;
    const avatar = photos[0].value;

    // Busca el usuario en la base de datos
    let user = await this.usersService.findOneByEmail(email);

    // Si no existe, crea un nuevo usuario
    if (!user) {
      user = await this.usersService.createGoogleUser({
        name: displayName,
        email: email,
        password: 'GOOGLE_USER',
        avatar,
      });
    }

    const userData = {
      id: user.id,
      name: user.name,
      role: user.role.description,
      avatar,
    };

    const response = {
      ...userData,
      accessToken: await this.authService.signToken(userData),
    };

    done(null, response);
  }
}
