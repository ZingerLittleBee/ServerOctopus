import { Injectable, UnauthorizedException } from '@nestjs/common';
import {UserService} from "@/user/user.service";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private usersService: UserService,
                private jwtService: JwtService
                ) {}

    async signIn(username: string, pass: string) {
        console.log(`AuthService.signIn: ${username}`)
        const user = await this.usersService.user({ username });
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.id, username: user.username };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
