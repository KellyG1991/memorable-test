import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { FileTypesEnums } from '../../utils/enums/file.types.enums';
import { Types } from 'mongoose';


export class AddAssetsDto
{

    @IsNotEmpty()
    @IsEnum( FileTypesEnums, {
        message: `type must be in ${ Object.values( FileTypesEnums ).join(
            ', ',
        ) }`,
    } )
    type: string

    @IsString()
    @IsNotEmpty()
    filename: string

    @IsString()
    @IsNotEmpty()
    extension: string

    @IsString()
    @IsNotEmpty()
    mimetype: string
}


export class UpdateAssetsDto
{

    @IsString()
    @IsNotEmpty()
    _id: Types.ObjectId

    @IsNumber()
    @Max( 100 )
    @Min( 0 )
    @IsNotEmpty()
    score_type_1: number

    @IsNumber()
    @Max( 100 )
    @Min( 0 )
    @IsNotEmpty()
    score_type_2: number

    @IsNumber()
    @Max( 100 )
    @Min( 0 )
    @IsNotEmpty()
    score_type_3: number
}