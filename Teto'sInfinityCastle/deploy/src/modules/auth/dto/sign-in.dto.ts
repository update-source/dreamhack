import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
