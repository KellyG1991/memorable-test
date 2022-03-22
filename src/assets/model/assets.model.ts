import { prop } from "@typegoose/typegoose";
import { FileTypesEnums } from "../../utils/enums/file.types.enums";
import { BaseSchema } from "../../utils/mongoose/base.schema";


export class AssetsModel extends BaseSchema
{
    @prop( { type: String, enum: FileTypesEnums, required: true } )
    type: FileTypesEnums

    @prop( { type: String, required: true } )
    filename: string

    @prop( { type: String, required: true } )
    extension: string

    @prop( { type: String, required: true } )
    mimetype: string

    @prop( { type: Number, required: false, min: 0, max: 100, default: 0, } )
    score_type_1?: number

    @prop( { type: Number, required: false, min: 0, max: 100, default: 0, } )
    score_type_2?: number

    @prop( { type: Number, required: false, min: 0, max: 100, default: 0 } )
    score_type_3?: number

    static get modelName ()
    {
        return 'Assets';
    }
}
