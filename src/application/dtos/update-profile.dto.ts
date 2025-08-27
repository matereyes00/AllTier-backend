import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({
        description: 'User name of the user for the application',
        example: 'JohnDoe32',
        minLength: 4
    })
    @IsOptional()
    @IsString({ message: 'Username must be a string' })
    username?: string;

    @ApiProperty({
		description: 'Password of the user to access the application and its features',
		example: 'AHeavyDefinitelyNotHackablePassword',
        minLength: 8
	})
    @IsOptional({message:'Password cannot be empty'})
    @MinLength(8, {message:'Password has to be at least 5 characters long'})
    password: string;
}
