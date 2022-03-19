
import { FileTypesEnums } from '../../utils/enums/file.types.enums';
import { Types } from 'mongoose';

export interface addAssets
{
    type: FileTypesEnums,
    filename: string,
    extension: string,
    mimetype: string,
}

export interface updateAssets
{
    _id: Types.ObjectId,
    score_type_1: number,
    score_type_2: number,
    score_type_3: number
}