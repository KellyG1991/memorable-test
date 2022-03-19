import { Module } from '@nestjs/common';

import { TimezoneMiddleware } from './tz.middlewares';

@Module({
    providers: [TimezoneMiddleware],
})
export class MiddlewareModule {}
