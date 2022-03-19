import { Matches } from "class-validator";

export class ObjectIdValidation {
    @Matches(/^[a-fA-F0-9]{24}/, { message: 'ID does not match a valid object id.'})
    _id: string;
}
