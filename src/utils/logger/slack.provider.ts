import Transport from 'winston-transport';
import { LEVEL, MESSAGE } from 'triple-beam';
import TransportStream from 'winston-transport';
import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from "@nestjs/axios"

@Injectable()
export class SlackTransportProvider extends Transport
{
  constructor (
    @Inject( 'SLACK_CONFIG' )
    private readonly _options: TransportStream.TransportStreamOptions &
      Record<string, any>,
    private readonly httpService: HttpService,
  )
  {
    super( _options );
  }

  log ( info: Record<string, any>, callback: Function )
  {

    const payload: Record<string, any> = {
      channel: this._options.channel,
      username: this._options.username || '',
    };

    const message = JSON.parse( info[ MESSAGE ] );

    payload.attachments = [
      {
        color: this._color( info[ LEVEL ] ),
        title: 'Corona Form Log',
        text: `${ message.message }`,
        fields: [
          {
            title: 'Priority',
            value: this._priority( info[ LEVEL ] ),
            short: false,
          },
        ],
      },
    ];

    this.httpService.post( this._options.route, payload ).pipe()

    return callback();


  }

  private _color ( level: 'warn' | 'error' )
  {
    const colors = {
      warn: '#fde70d',
      error: '#fd0d0d',
    };
    return colors[ level ];
  }

  private _priority ( level: 'warn' | 'error' )
  {
    const priority = {
      warn: 'Medium',
      error: 'High',
    };
    return priority[ level ];
  }
}
