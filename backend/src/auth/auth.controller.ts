import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { JwtAuthGuard, RefreshTokenGuard } from './guards/auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Registering a new user' })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully registered',
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(
      signUpDto.email,
      signUpDto.password,
      signUpDto.name
    );
  }

  @Post('signin')
  @ApiOperation({ summary: 'Signing in a user' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully signed in',
  })
  @ApiResponse({
    status: 401,
    description: 'Credentials are not valid',
  })
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Getting user profile' })
  @ApiResponse({ status: 200, description: 'User profile has been received' })
  getProfile(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logging out user' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully logged out',
  })
  async logout(@Request() req: any) {
    return this.authService.logout(req.user.userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Refreshing tokens' })
  @ApiResponse({
    status: 200,
    description: 'Tokens have been successfully refreshed',
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token is not valid',
  })
  async refreshTokens(@Request() req: any) {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
