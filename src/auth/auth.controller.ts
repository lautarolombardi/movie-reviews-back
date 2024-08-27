import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './guards/auth.guard';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    const userData = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    return {
      message: 'Usuario autenticado',
      statusCode: HttpStatus.OK,
      data: userData,
    };
  }

  @Post('validate-user')
  @UseGuards(AuthGuard)
  validateUser(@Req() req: any) {
    return this.authService.validateUser(req.headers.authorization);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req: any) {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const { user } = await this.authService.googleLogin(req);

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?id=${user.id}&name=${user.name}&role=${user.role}&avatar=${user.avatar}&token=${user.accessToken}`,
    );
  }
}
