import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
export class AuthCredentialsDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*#/, {
    message: 'password too weak, try another strong password',
  })
  password: string;
}
