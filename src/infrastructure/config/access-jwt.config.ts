import { registerAs } from '@nestjs/config'
import { JwtSignOptions } from '@nestjs/jwt'

export default registerAs(
    'jwt', 
    (): JwtSignOptions => ({
        secret:process.env.ACCESS_TOKEN_SECRET_KEY,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
    })
)