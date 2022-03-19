import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { FileTypesEnums } from "../../utils/enums/file.types.enums";
import { ScoreTypesEnums } from "../../utils/enums/score.types.enums";


export class ScoreQueryDto
{

    @IsString()
    @IsNotEmpty()
    @IsEnum( ScoreTypesEnums, {
        message: `score_type must be in ${ Object.values( ScoreTypesEnums ).join( ", " ) }`
    } )
    score_type: string

    @IsString()
    @IsNotEmpty()
    @IsEnum( FileTypesEnums, {
        message: `asset_type must be in ${ Object.values( FileTypesEnums ).join(
            ', ',
        ) }`,
    } )
    asset_type: string
}