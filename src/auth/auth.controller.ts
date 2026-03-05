import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registra un nuovo utente' })
  @ApiResponse({ status: 201, description: 'Utente registrato con successo' })
  @ApiResponse({ status: 409, description: 'Email già registrata' })
  @ApiBody({ type: RegisterDto })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login: restituisce JWT access token' })
  @ApiResponse({
    status: 200,
    description: 'Login effettuato con successo, ritorna JWT',
  })
  @ApiResponse({ status: 401, description: 'Credenziali non valide' })
  @ApiBody({ type: LoginDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
