import {
  WinstonModuleOptions,
  WinstonModuleOptionsFactory,
} from 'nest-winston';
import 'winston-daily-rotate-file';
import Transport from 'winston-transport';
import { Injectable } from '@nestjs/common';
import { transports, format } from 'winston';
import { ConfigService } from '@nestjs/config';
import { SlackTransportProvider } from './slack.provider';

const { combine, timestamp, logstash, simple } = format;

@Injectable()
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly slackTransportProvider: SlackTransportProvider,
  ) {}

  createWinstonModuleOptions(): WinstonModuleOptions {
    const production = this.configService.get('app.env') === 'production';

    return {
      transports: this._transports('log', production),
      exceptionHandlers: this._transports('exception', production),
    };
  }

  private _transports(name: string, production: boolean): Transport[] {
    const transports = [this._createDailyLoggerTransport(name)];
    production && transports.push(this._createSlackLoggerTransport);
    !production && transports.push(this._createConsoleLoggerTransport);
    return transports;
  }

  private _createDailyLoggerTransport(file: string): Transport {
    return new transports.DailyRotateFile({
      filename: `${this.configService.get<string>(
        'app.name',
      )}-${file}-%DATE%.log`,
      dirname: 'logs',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      auditFile: `logs/${this.configService.get<string>('app.name')}.json`,
      format: combine(timestamp(), logstash()),
      level: 'info',
    });
  }

  private get _createConsoleLoggerTransport(): Transport {
    return new transports.Console({
      level: 'silly',
      format: simple(),
    });
  }

  private get _createSlackLoggerTransport(): Transport {
    return this.slackTransportProvider as Transport;
  }
}
