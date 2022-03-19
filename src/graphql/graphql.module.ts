import gql from './config/gql';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLConfigService } from './graphql-config.service';
import { GraphQLModule as OriginalModule } from '@nestjs/graphql';

@Module( {
    imports: [
        ConfigModule.forFeature( gql ),
        OriginalModule.forRootAsync( {
            useClass: GraphQLConfigService,
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
        } ),
    ],
} )
export class GraphQLModule { }
