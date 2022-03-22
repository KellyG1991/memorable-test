import { Test, TestingModule } from '@nestjs/testing';
import { AssetsService } from './assets.service';
import { getModelToken } from '@nestjs/mongoose';
import { AssetsModel } from './model/assets.model';
import { Types } from 'mongoose'
import { FileTypesEnums } from '../utils/enums/file.types.enums';


import Chance from 'chance'
import { HttpStatus, BadRequestException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';




describe( 'AssetsService', () =>
{
  let assetsService: ReturnModelType<
    typeof AssetsModel
  >;

  const chance = new Chance()
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
    score_type_1: 0,
    score_type_2: 0,
    score_type_3: 0
  }

  const mockAssetRepository = {
    updateOne: jest.fn(),
    create: jest.fn().mockResolvedValue( mockAsset ),
    findById: jest.fn(),
    updateById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    aggregate: jest.fn(),
    findOne: jest.fn()
  }

  beforeEach( async () =>
  {
    const module: TestingModule = await Test.createTestingModule( {
      providers: [
        AssetsService,
        {
          provide: getModelToken( AssetsModel.modelName ),
          useValue: mockAssetRepository
        },
      ],
    } ).compile();

    assetsService = module.get<AssetsService>( AssetsService );
  } );

  it( 'should be defined', () =>
  {
    expect( assetsService ).toBeDefined();
  } );

  it( 'should add assets', async () =>
  {

    const { status, data } = await assetsService.addAsset( assetsModel )

    expect( status ).toBe( HttpStatus.CREATED )
    expect( data ).toMatchObject( Object.assign( assetsModel ) )
  } )

  it( "should not add assets if duplicate is identified", async () =>
  {
    mockAssetRepository.findOne.mockResolvedValue( mockAsset )

    const { status, message } = await assetsService.addAsset( assetsModel )

    expect( status ).toBe( HttpStatus.BAD_REQUEST )
    expect( message ).toBe( 'Duplicate asset detected.' )
  } )

  it( "should update asset with scores", async () =>
  {
    const scores = {
      _id: mockAsset._id,
      score_type_1: 80,
      score_type_2: 90,
      score_type_3: 87
    }

    const updatedAsset = {
      extension: mockAsset.extension,
      filename: mockAsset.filename,
      mimetype: mockAsset.mimetype,
      type: mockAsset.type,
      ...scores
    }

    mockAssetRepository.updateById.mockResolvedValue( updatedAsset )

    mockAssetRepository.findById.mockResolvedValue( updatedAsset )


    const { status, data } = await assetsService.updateAsset( scores )

    expect( status ).toBe( HttpStatus.OK )
    expect( data ).toMatchObject( scores )
  } )


  it( 'should throw error if asset does not exist', async () =>
  {

    const scores = {
      _id: "ksljdflsjlfdjosjdif",
      score_type_1: 80,
      score_type_2: 90,
      score_type_3: 87
    }

    mockAssetRepository.findById.mockResolvedValue( null )
    mockAssetRepository.updateById.mockResolvedValue( mockAsset )

    const { status, message } = await assetsService.updateAsset( scores )

    expect( status ).toBe( HttpStatus.NOT_FOUND )
    expect( message ).toBe( 'Asset not found.' )
  } )


  it( 'should get an asset', async () =>
  {
    mockAssetRepository.findById.mockResolvedValue( mockAsset )

    const { status, data } = await assetsService.getAsset( mockAsset._id )

    expect( status ).toBe( HttpStatus.OK )
    expect( data ).toMatchObject( mockAsset )
  } )

  it( 'should get average score based on score_type and asset_type', async () =>
  {
    const assets = [ {
      _id: Types.ObjectId(),
      filename: chance.name(),
      type: FileTypesEnums.IMAGE,
      mimetype: "image/png",
      extension: "png",
      score_type_1: 20,
      score_type_2: 45,
      score_type_3: 99
    },
    {
      _id: Types.ObjectId(),
      filename: chance.name(),
      type: FileTypesEnums.IMAGE,
      mimetype: "image/png",
      extension: "png",
      score_type_1: 25,
      score_type_2: 65,
      score_type_3: 39
    },
    {
      _id: Types.ObjectId(),
      filename: chance.name(),
      type: FileTypesEnums.VIDEO,
      mimetype: "video/mp4",
      extension: "mp4",
      score_type_1: 70,
      score_type_2: 42,
      score_type_3: 91
    } ]


    let averageData: Number;

    const averageFunction = ( score_type: string, asset_type: string ) =>
    {
      const found = assets.filter( val => val.type === asset_type )
      const length = found.length;

      const avg = ( array ) => array.length > 1 ? array.reduce( ( a, b ) => a[ score_type ] + b[ score_type ] ) / length : array[ 0 ][ score_type ] ? array[ 0 ][ score_type ] : 0
      averageData = avg( found )
      return [ { average_score: averageData } ]
    }


    mockAssetRepository.aggregate.mockReturnValue( averageFunction( "score_type_1", "video" ) )

    const { status, average } = await assetsService.getAverageScore( "score_type_1", "video" )

    expect( status ).toBe( HttpStatus.OK );
    expect( average ).toBe( averageData )

  } )

} );
