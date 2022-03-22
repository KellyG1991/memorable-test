import { Module } from '@nestjs/common';
import { MongooseModule, } from '@nestjs/mongoose';
import { AssetsService } from './assets.service';
import { AssetsResolver } from './graphql/resolver/assets.resolver';
import { AssetsModel } from './model/assets.model';

@Module( {
  imports: [
    MongooseModule.forFeature( [
      {
        name: AssetsModel.modelName,
        schema: AssetsModel.buildSchema
      }
    ] )
  ],
  providers: [
    AssetsService,
    AssetsResolver,
  ],
  exports: [ AssetsService ]
} )
export class AssetsModule { }
