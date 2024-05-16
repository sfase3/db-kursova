import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({ status: 200, description: 'Login successful' })
  login(@Body() authPayload: AuthPayloadDto) {
    return this.authService.login(authPayload);
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'Registration successful' })
  register(@Body() authPayload: AuthPayloadDto) {
    return this.authService.registration(authPayload);
  }
}
