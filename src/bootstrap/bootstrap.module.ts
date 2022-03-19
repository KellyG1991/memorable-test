import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { TaskService } from './task.service';
import { MiddlewareModule } from './middlewares/middleware.module';
import { AssetsModule } from '../assets/assets.module';

@Module( {
    imports: [ ScheduleModule.forRoot(), MiddlewareModule, AssetsModule ],
    providers: [ TaskService ],
} )
export class BootstrapModule { }
