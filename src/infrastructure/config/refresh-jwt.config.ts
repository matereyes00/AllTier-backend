import { registerAs } from '@nestjs/config'
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt'

export default registerAs(
    'jwt-refresh', 
    (): JwtSignOptions => ({
        secret:process.env.REFRESH_TOKEN_SECRET_KEY,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
    })
)