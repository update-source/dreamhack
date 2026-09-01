import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class AddUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
