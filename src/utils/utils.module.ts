import { APP_FILTER } from '@nestjs/core';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MomentService } from './moment/moment.service';
import { ValidationModule } from './validation/validation.module';
import { WinstonModule as OriginalWinstonModule } from 'nest-winston';
import { WinstonConfigService } from './logger/winston-config.service';
import { SlackTransportProvider } from './logger/slack.provider';
import { WinstonModule } from './logger/winston.module';
import { HttpExceptionFilter } from './filters/http/exceptions.filter';

@Global()
@Module( {
  imports: [
    ValidationModule,
    OriginalWinstonModule.forRootAsync( {
      imports: [ WinstonModule ],
      useClass: WinstonConfigService,
      inject: [ ConfigService, SlackTransportProvider ],
    } ),
  ],
  providers: [
    MomentService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ]
} )
export class UtilsModule { }
