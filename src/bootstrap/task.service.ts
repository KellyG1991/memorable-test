

import debug from 'debug';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AssetsService } from '../assets/assets.service';
import { ConfigService } from '@nestjs/config';
import { Chance } from 'chance'
import { FileTypesEnums } from '../utils/enums/file.types.enums';
import { Logger } from 'winston';

@Injectable()
export class TaskService
{
    private chance = new Chance();

    constructor (
        private readonly assetsService: AssetsService,
        private readonly configService: ConfigService,
        @Inject( "winston" )
        private logger: Logger
    ) { }

    @Cron( new Date( Date.now() + 5 * 1000 ) )
    async seedData ()
    {
        if ( this.configService.get( "app.env" ) !== 'production' )
        {


            for ( let i = 0; i <= 20; i++ )
            {
                const fakeAssets = {
                    filename: this.chance.name(),
                    type: this.chance.pickone( Object.values( FileTypesEnums ) ),
                    get mimetype ()
                    {
                        return this.type === FileTypesEnums.IMAGE ? "image/png" : "video/mp4"
                    },
                    get extension ()
                    {
                        return this.type === FileTypesEnums.IMAGE ? "png" : "mp4"
                    },
                    score_type_1: this.chance.natural( { min: 0, max: 100 } ),
                    score_type_2: this.chance.natural( { min: 0, max: 100 } ),
                    score_type_3: this.chance.natural( { min: 0, max: 100 } )
                }
                await this.assetsService.addAsset( Object.assign( fakeAssets ) )
            }

            this.logger.info( "Seeding Complete" )
        }
    }
}
