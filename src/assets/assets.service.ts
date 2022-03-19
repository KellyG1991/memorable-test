import { Injectable, HttpStatus, NotFoundException } from '@nestjs/common';
import { BaseService } from '../utils/mongoose/base.service';
import { AssetsModel } from './model/assets.model';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { addAssets, updateAssets } from '../utils/interfaces/asset.interface';
import { FileTypesEnums } from '../utils/enums/file.types.enums';
import { OnModuleInit } from '@nestjs/common';

@Injectable()
export class AssetsService extends BaseService<AssetsModel>
    implements OnModuleInit
{
    constructor (
        @InjectConnection()
        private readonly connection: Connection,
        @InjectModel( AssetsModel.modelName )
        private readonly assetsModel: ReturnModelType<
            typeof AssetsModel
        >,
    )
    {
        super( assetsModel );
    }

    async onModuleInit ()
    {
        // const caseCollection = this.connection.db.collection('users');
    }

    async addAsset ( assetBody: addAssets )
    {
        return {
            status: HttpStatus.CREATED,
            data: await super.create( Object.assign( assetBody ) )
        }
    }

    async updateAsset ( updateBody: updateAssets )
    {

        const exists = await super.findById( updateBody._id )

        if ( !exists ) throw new NotFoundException( "Asset Not Found" )

        await super.updateById(
            updateBody._id,
            {
                score_type_1: updateBody.score_type_1,
                score_type_2: updateBody.score_type_2,
                score_type_3: updateBody.score_type_3
            } )

        return {
            status: HttpStatus.OK,
            data: await super.findById( updateBody._id )
        }
    }

    async getAsset ( _id: Types.ObjectId )
    {

        const exists = await super.findById( _id )
        if ( !exists ) throw new NotFoundException( "Asset not found" )

        return {
            status: HttpStatus.OK,
            data: exists
        }
    }

    async getAverageScore ( score_type: string, asset_type: string )
    {
        const average = ( await super.aggregate( [
            { $match: { type: asset_type } },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    [ score_type ]: 1
                }
            },
            {
                $group: {
                    _id: "_id",
                    average_score: { $avg: `$${ score_type }` }
                }
            },
            {
                $project: {
                    _id: 0,
                    average_score: { $round: [ "$average_score", 2 ] }
                }
            }
        ] ) )[ 0 ]

        return {
            status: HttpStatus.OK,
            average: average.average_score
        }
    }
}
