import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";
import { Injectable } from "@nestjs/common";

/**
 * DateFormatValidator
 * @class
 * @private @property {MomentService} momentService
 */
@Injectable()
@ValidatorConstraint({ async: true, name: 'isDateFormat' })
export class DateFormatValidator implements ValidatorConstraintInterface {
    /**
     * Validate function
     * @param {string} value Input value
     * @param {ValidationArguments} args Validation Arguments
     * @return <boolean>
     */
    validate(value: string): boolean {
        return !!value.trim();
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} doesn't match format ${args.constraints[0]}`;
    }
}
