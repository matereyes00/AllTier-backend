import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This is the unique identifier the user will go by.',
    minimum: 4,
    example: 'JohnDoe32',
    maximum: 20,
  })
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This is what is needed for the user to access their account.',
    maximum: 20,
    minimum: 8,
    example: 'AVeryStrongPassword',
  })
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This is used to verify the created password.',
    maximum: 20,
    minimum: 8,
    example: 'AVeryStrongPassword',
  })
  confirmPassword: string;

  @ApiProperty({
    description: 'Email of a user',
    example: 'johndoe@example.com',
  })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Email has to be valid email' })
  email: string;
}
