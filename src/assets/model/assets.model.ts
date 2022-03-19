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

    @prop( { type: Number, required: false, default: 0, min: 0, max: 100 } )
    score_type_1?: Number

    @prop( { type: Number, required: false, default: 0, min: 0, max: 100 } )
    score_type_2?: Number

    @prop( { type: Number, required: false, default: 0, min: 0, max: 100 } )
    score_type_3?: Number

    static get modelName ()
    {
        return 'Assets';
    }
}
