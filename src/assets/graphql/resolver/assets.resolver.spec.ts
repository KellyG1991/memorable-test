import { Test, TestingModule } from '@nestjs/testing';
import { FileTypesEnums } from '../../../utils/enums/file.types.enums';
import request from 'supertest'
import { INestApplication, HttpStatus } from '@nestjs/common';
import { AppModule } from '../../../app.module';
import { Connection, Types } from 'mongoose';
import { TestDatabaseService } from '../../../database/testDatabaseService';
import Chance from 'chance'
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { ScoreTypesEnums } from '../../../utils/enums/score.types.enums';
import { AssetsService } from '../../assets.service'

describe( 'Graphql/Assets', () =>
{
    let connection: Connection;
    let app: INestApplication
    let graphqlServer;
    let chance = new Chance()
    let reusable_asset_id;
    let assetService: AssetsService


    beforeAll( async () =>
    {
        const moduleRef = await Test.createTestingModule( {
            imports: [ AppModule ],
        } ).

            compile();

        app = moduleRef.createNestApplication();
        await app.init();
        graphqlServer = app.getHttpServer()
        connection = moduleRef
            .get<TestDatabaseService>( TestDatabaseService )
            .getHandle();
        await connection.dropDatabase();
        assetService = moduleRef.get<AssetsService>( AssetsService )

    } );


    describe( "Mutations", () =>
    {
        it( "should add an asset using add_asset mutation", async () =>
        {
            const assetObject = {
                filename: chance.name(),
                type: chance.pickone( Object.values( FileTypesEnums ) ),
                get mimetype ()
                {
                    return this.type === FileTypesEnums.IMAGE ? "image/png" : "video/mp4"
                },
                get extension ()
                {
                    return this.type === FileTypesEnums.IMAGE ? "png" : "mp4"
                }
            }
            const {
                body: {
                    data: {
                        add_asset: {
                            status, data
                        }
                    }
                } } = await request( graphqlServer )
                    .post( '/graphql' )
                    .send( {
                        query: `
                        mutation{
                            add_asset(body:{
                              type:"${ assetObject.type }",
                              filename:"${ assetObject.filename }",
                              mimetype:"${ assetObject.mimetype }",
                              extension:"${ assetObject.extension }"
                            }){
                              ...on AssetResponse{
                                status
                                data{
                                  _id
                                  filename
                                  type
                                  mimetype
                                  extension
                                      }
                              }
                            }
                          }
            `} )
            reusable_asset_id = data._id
            expect( status ).toBe( HttpStatus.CREATED )
            expect( data ).toBeDefined()
            expect( data ).toMatchObject( assetObject )
        } )

        it( 'should check if all required body fields are provided before adding an asset', async () =>
        {
            const wrongAssetObject = {
                filename: chance.name(),
                type: chance.pickone( Object.values( FileTypesEnums ) )
            }


            const response = await request( graphqlServer )
                .post( '/graphql' )
                .send( {
                    query: `
                    mutation{
                        add_asset(body:{
                          type:"${ wrongAssetObject.type }",
                          filename:"${ wrongAssetObject.filename }",
                        }){
                          ...on AssetResponse{
                            status
                            data{
                              filename
                              type
                              mimetype
                              extension
                                  }
                          }
                        }
                      }
        `} )
            expect( response.body.errors[ 0 ].status ).toBe( HttpStatus.INTERNAL_SERVER_ERROR )
            expect( response.body.errors[ 0 ].message ).toBeDefined()
            expect( response.text ).toContain( "Assets validation failed: mimetype: Path `mimetype` is required., extension: Path `extension` is required." )
        } )

        it( "should add scores to an asset by using add_scores mutation", async () =>
        {
            const scoresBody = {
                _id: reusable_asset_id,
                score_type_1: chance.natural( { min: 0, max: 100 } ),
                score_type_2: chance.natural( { min: 0, max: 100 } ),
                score_type_3: chance.natural( { min: 0, max: 100 } )
            }

            const { body: {
                data: {
                    add_scores: {
                        status, data
                    }
                }
            } } = await request( graphqlServer )
                .post( '/graphql' )
                .send( {
                    query: `
                    mutation{
                        add_scores(body:{
                            _id:"${ scoresBody._id }",
                            score_type_1: ${ scoresBody.score_type_1 },
                            score_type_2: ${ scoresBody.score_type_2 },
                            score_type_3:${ scoresBody.score_type_3 }
                        }){
                        ...on AssetResponse{
                            
                            status
                            data{
                            _id
                            filename
                            extension
                            mimetype
                            type
                            score_type_1
                            score_type_2
                            score_type_3
                            }
                            }
                        }
                        
                    }
            `} )


            expect( status ).toBe( HttpStatus.OK )
            expect( data ).toBeDefined()
            expect( data ).toMatchObject( scoresBody )
        } )

        it( "should check if all required body fields are provided before adding scores to an asset", async () =>
        {
            const scoresBody = {
                _id: reusable_asset_id,
                score_type_1: 198,
            }

            const response = await request( graphqlServer )
                .post( '/graphql' )
                .send( {
                    query: `
                    mutation{
                        add_scores(body:{
                            _id:"${ scoresBody._id }",
                            score_type_1: ${ scoresBody.score_type_1 }
                        }){
                        ...on AssetResponse{ 
                            status
                            data{
                            _id
                            filename
                            extension
                            mimetype
                            type
                            score_type_1
                            score_type_2
                            score_type_3
                            }
                            }
                        }
                        
                    }
            `} )

            expect( response.status ).toBe( HttpStatus.BAD_REQUEST )
            expect( response.body.errors ).toHaveLength( 2 )

        } )

    } )


    describe( "Queries", () =>
    {
        it( "should get an asset using get_asset Query", async () =>
        {
            const {
                body: {
                    data: {
                        get_asset: { status, data }
                    }
                }
            } = await request( graphqlServer )
                .post( '/graphql' )
                .send( {
                    query: `
            query{
                get_asset(_id: "${ reusable_asset_id }"){
                  ...on AssetResponse{
                    status
                    data{
                      _id
                      filename
                      mimetype
                      extension
                    }
                  }
                }
              }
            `} )

            expect( status ).toBe( HttpStatus.OK )
            expect( data ).toBeDefined()
            expect( data._id ).toEqual( reusable_asset_id )
        } )

        it( "should get the average using get_average_score_asset_type Query", async () =>
        {

            // add 20 fake assets with scores
            for ( let x = 0; x < 20; x++ )
            {
                const assetsModel = {
                    filename: chance.name(),
                    type: chance.pickone( Object.values( FileTypesEnums ) ),
                    get mimetype ()
                    {
                        return this.type === FileTypesEnums.IMAGE ? "image/png" : "video/mp4"
                    },
                    get extension ()
                    {
                        return this.type === FileTypesEnums.IMAGE ? "png" : "mp4"
                    },
                }
                const mockAsset = {
                    _id: Types.ObjectId(),
                    ...assetsModel,
                    score_type_1: chance.natural( { min: 0, max: 100 } ),
                    score_type_2: chance.natural( { min: 0, max: 100 } ),
                    score_type_3: chance.natural( { min: 0, max: 100 } )
                }

                await assetService.create( Object.assign( mockAsset ) )
            }

            const actualResult = await assetService.getAverageScore( ScoreTypesEnums.TYPE1, FileTypesEnums.VIDEO )

            const {
                body: {
                    data: {
                        get_average_score_asset_type: { status, average }
                    }
                }
            } = await request( graphqlServer )
                .post( '/graphql' )
                .send( {
                    query: `
                    query{
                        get_average_score_asset_type(query:{
                          score_type: "${ ScoreTypesEnums.TYPE1 }",
                          asset_type:"${ FileTypesEnums.VIDEO }"
                        }){
                          ...on AverageResponse{
                            status
                            average
                          }
                        }
                      }
            `} )

            expect( status ).toBe( HttpStatus.OK )
            expect( average ).toBeDefined()
            expect( average ).toEqual( actualResult.average )

        } )
    } )

    afterAll( async () =>
    {
        await app.close();
    } );
} )