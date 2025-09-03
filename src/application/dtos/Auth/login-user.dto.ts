import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'This is the unique identifier the user will go by.',
    minimum: 4,
    maximum: 20,
    example: 'JohnDoe32',
    type: String,
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'This is what is needed for the user to access their account.',
    minimum: 8,
    example: 'AVeryStrongPassword',
    maximum: 20,
    type: String,
  })
  password: string;
}
