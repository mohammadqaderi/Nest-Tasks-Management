import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: UserRepository,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    if (!username) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT token with payload: ${JSON.stringify(payload)}`,
    );
    return { accessToken };
  }
}
