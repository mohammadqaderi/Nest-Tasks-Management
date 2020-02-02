import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { BadRequestException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = new User();
    user.salt = await bcrypt.genSalt();
    user.username = username;
    user.password = await this.hashPassword(password, user.salt);
    const query = this.createQueryBuilder('user');
    const users = await query
      .select('username')
      .where('user.username LIKE :username', { username });
    if (await users.getCount()) {
      throw new ConflictException('username is already exist in the database');
    } else {
      await user.save();
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      return username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
