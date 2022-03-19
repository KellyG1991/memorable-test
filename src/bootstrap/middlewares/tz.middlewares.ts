// prettier-ignore
import {
    Injectable,
    NestMiddleware
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TimezoneMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) {}

    use(req: Request, res: Response, next: Function): void {
        res.header(
            'X-Server-Timezone',
            this.configService.get<string>('app.timezone'),
        );

        return next();
    }
}
