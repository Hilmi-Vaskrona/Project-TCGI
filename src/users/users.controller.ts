import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req) {
        const userId = req.user.userId;

        const profile = await this.usersService.getProfile(userId);

        return {
            message: 'Profile fetched',
            data: profile,
        };
    }
}