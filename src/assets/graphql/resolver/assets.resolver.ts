import { UseFilters } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLExceptionFilter } from '../../../utils/filters/graphql/exception.filter';
import { AssetsService } from '../../assets.service';
import { AddAssetsDto, UpdateAssetsDto } from '../../../utils/dtos/assets.dto';
import { ScoreQueryDto } from '../../../utils/dtos/score.query.dto';

@Resolver()
export class AssetsResolver
{

    constructor (
        private readonly assetsService: AssetsService
    ) { }


    @Query( 'get_asset' )
    @UseFilters( GraphQLExceptionFilter )
    async getAsset ( @Args( "_id" ) _id: string )
    {
        return this.assetsService.getAsset( _id )
    }

    @Query( 'get_average_score_asset_type' )
    @UseFilters( GraphQLExceptionFilter )
    async getAverageScore ( @Args( "query" ) query: ScoreQueryDto )
    {
        return this.assetsService.getAverageScore( query.score_type, query.asset_type )
    }

    @Mutation( "add_asset" )
    @UseFilters( GraphQLExceptionFilter )
    async addAsset ( @Args( "body" ) body: AddAssetsDto )
    {
        return this.assetsService.addAsset( Object.assign( body ) )
    }

    @Mutation( "add_scores" )
    @UseFilters( GraphQLExceptionFilter )
    async addScoreTypes ( @Args( "body" ) body: UpdateAssetsDto )
    {
        return this.assetsService.updateAsset( Object.assign( body ) )
    }
}
