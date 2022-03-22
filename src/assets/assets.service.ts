import { Injectable, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { BaseService } from '../utils/mongoose/base.service';
import { AssetsModel } from './model/assets.model';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { addAssets, updateAssets } from '../utils/interfaces/asset.interface';
import { OnModuleInit } from '@nestjs/common';

@Injectable()
export class AssetsService extends BaseService<AssetsModel>
    implements OnModuleInit
{
    constructor (

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
        const exists = await super.findOne( Object.assign( assetBody ) );
        if ( exists ) return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Duplicate asset detected.'
        }
        return {
            status: HttpStatus.CREATED,
            data: await super.create( Object.assign( assetBody ) )
        }
    }

    async updateAsset ( updateBody: updateAssets )
    {

        const exists = await super.findById( updateBody._id )

        if ( !exists ) return {
            status: HttpStatus.NOT_FOUND,
            message: "Asset not found."
        }

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
